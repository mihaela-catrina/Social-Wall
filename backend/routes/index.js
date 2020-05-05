const Router = require('express')();

const UsersController = require('../Users/controllers.js');
const MessagesController = require('../Messages/controller.js');

Router.use('/users', UsersController);
Router.use('/messages', MessagesController);

module.exports = Router;