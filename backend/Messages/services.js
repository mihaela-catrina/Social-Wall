const {
    Messages
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

const postMessage = async (userId, subject, message) => {
    const messageObj = new Messages({
        userId,
        subject,
        message
    });

    await messageObj.save();
};

const sendResponseEmail = async (userId, message, originalMessage) => {
    const user = await getById(userId);
    sendResponse(user.email, message, originalMessage)
    await Messages.findByIdAndUpdate(originalMessage._id, { resolved: true, response: message });
};

const getAll = async () => {
    return await Messages.find();
};

const removeById = async (id) => {
    return await Messages.remove({"_id": id});
};

const remove = async () => {
    return await Messages.remove({});
}

const setImportanceFlag = async (id) => {
    await Messages.findByIdAndUpdate(id, { important: true });
};

module.exports = {
    postMessage,
    getAll,
    sendResponseEmail,
    remove,
    removeById,
    setImportanceFlag
}