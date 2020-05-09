const Router = require('express')();

const UsersController = require('../Users/controllers.js');
const MessagesController = require('../Messages/controller.js');
const IdeasController = require('../Ideas/controller.js');

Router.use('/users', UsersController);
Router.use('/messages', MessagesController);
Router.use('/ideas', IdeasController)

module.exports = Router;