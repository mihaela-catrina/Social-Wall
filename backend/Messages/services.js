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
};

const getAll = async () => {
    return await Messages.find();
};

module.exports = {
    postMessage,
    getAll,
    sendResponseEmail
}