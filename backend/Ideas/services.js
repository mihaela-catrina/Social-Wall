const {
    Ideas
} = require('../data');

const {
    ServerError
} = require('../errors');

const {
    sendResponse
} = require('../Email/controller')

const {
    getById
} = require('../Users/services')

const postIdea = async (userId, subject, description, authority, tags) => {
    const user = await getById(userId);
    const username = user.firstName + " " + user.lastName;
    const ideaObj = new Ideas({
        userId,
        user: username,
        subject,
        description,
        authority,
        tags
    });


    await ideaObj.save();
};

const getAll = async () => {
    return await Ideas.find();
};

const levelUp = async (id) => {
    await Ideas.findByIdAndUpdate(id,  { $inc: { thumbUp: 1 } });
};

const levelDown = async (id) => {
    await Ideas.findByIdAndUpdate(id,  { $inc: { thumbDown: 1 } });
};

const heart = async (id) => {
    await Ideas.findByIdAndUpdate(id,  { $inc: { heart: 1 } });
};

const remove = async () => {
    return await Ideas.remove({});
}


module.exports = {
    postIdea,
    getAll,
    levelUp,
    levelDown,
    heart,
    remove
}