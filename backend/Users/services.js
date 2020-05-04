const {
    Users
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

    existingUser = await Users.findOne({ email: user.email });
    if (existingUser)
        return await collectEmail(existingUser, false);
    else {
        await user.save();
        return await collectEmail(user,true);
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

const getById = async (id) => {
    return await Users.findById(id);
};

const remove = async () => {
    return await Users.remove({});
}

const checkConfirmedAccount = async (username) => {
    user = await Users.findOne({ username });
    console.log(user);
    if (user === null) {
        throw new ServerError(`Utilizatorul inregistrat cu ${username} nu exista!`, 404);
    }

    if (user.confirmed)
        return true;
    
    return false;
}

const authenticate = async (username, password) => {

    const user = await Users.findOne({ username });
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
    checkConfirmedAccount
}