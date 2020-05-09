const {
    Users,
} = require('../data');

const {
    collectEmail,
    confirmEmail
} = require('../Email/controller')

const {
    generateToken,
} = require('../security/Jwt');

const {
    ServerError
} = require('../errors');

const {
    hash,
    compare
} = require('../security/Password');

const addDefaultAdmin = async () => {
    console.log("adddd");
    const existingUser = await Users.findOne({ username: "admin" });
    if (!existingUser) {
        const hashedPassword = await hash("admin");
        const user = new Users({
            role: "admin",
            email: "admin@gmail.com",
            firstName: "Admin",
            lastName: "Default",
            username: "admin",
            password: hashedPassword,
            confirmed: true
        });
        await user.save();
    }
}

const add = async (role, email, firstName, lastName, username, password) => {
    const hashedPassword = await hash(password);
    const user = new Users({
        role,
        email,
        firstName,
        lastName,
        username,
        password: hashedPassword
    });

    if (role !== "local-authority") {
        existingUser = await Users.findOne({ email: user.email });
        if (existingUser)
            return await collectEmail(existingUser, false);
        else {
            await user.save();
            return await collectEmail(user,true);
        }
    } else {
        await user.save();
        return {msg: "You account will be verifyed soon!"};
    }
};

const addSupport = async (role, username, password) => {
    const hashedPassword = await hash(password);
    const user = new Users({
        role,
        username,
        password: hashedPassword,
        confirmed: true
    });

    await user.save();
};

const getAll = async () => {
    return await Users.find();
};

const getPending = async () => {
    return await Users.find({role: "local-authority", confirmed: false});
};

const getById = async (id) => {
    return await Users.findById(id);
};

const remove = async () => {
    return await Users.remove({});
}

const approve = async (id) => {
    const user = await Users.findByIdAndUpdate(id, { confirmed: true });
    if (user === null) {
        throw new ServerError(`Utilizatorul inregistrat cu ${id} nu exista!`, 404);
    }
    
    return {msg: "This account has been approved!"}
}

const checkConfirmedAccount = async (username) => {
    user = await Users.findOne({ username }) || await Users.findOne({email: username})
    console.log(user);
    if (user === null) {
        throw new ServerError(`Utilizatorul inregistrat cu ${username} nu exista!`, 404);
    }

    if (user.confirmed)
        return {status: true, role: user.role}
    
    return {status: false, role: user.role}
}

const authenticate = async (username, password) => {

    console.log(username);
    const user = await Users.findOne({ username }) || await Users.findOne({email: username})
    if (user === null) {
        throw new ServerError(`Utilizatorul inregistrat cu ${username} nu exista!`, 404);
    }
    
    if (await compare(password, user.password)) {
        const token = await generateToken({
            userId: user._id,
            userRole: user.role
        });
        return {user, token};
    } 
    throw new ServerError("Combinatia de username si parola nu este buna!", 404);
};

module.exports = {
    add,
    addSupport,
    authenticate,
    getAll,
    getById,
    remove,
    checkConfirmedAccount,
    getPending,
    approve,
    addDefaultAdmin
}