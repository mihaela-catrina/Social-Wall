const express = require('express');

const MessagesService = require('./services.js');
const {
    validateFields
} = require('../utils');

const {
    authorizeAndExtractToken
} = require('../security/Jwt');

const {
    authorizeRoles
} = require('../security/Roles');

const {
    confirmEmail
} = require('../Email/controller')

const router = express.Router();

router.post('/contact', async (req, res, next) => {
    const body = JSON.parse(req.body);
    const {
        userId,
        subject,
        message
    } = body;

    console.log(subject);
  
    try {
        const fieldsToBeValidated = {
            userId: {
                value: userId,
                type: 'ascii'
            }
        };
    
        validateFields(fieldsToBeValidated);

        await MessagesService.postMessage(userId, subject, message);
            
        res.status(200).json({
                    msg: "Thank you for your message!",
        });
    } catch (err) {
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'tehnical_support'), async (req, res, next) => {
    try {
        const messages = await MessagesService.getAll();
        res.json(messages);
    } catch (err) {
        next(err);
    }
});

router.get('/important', async (req, res, next) => {
    try {
        const messages = await MessagesService.getAll();
        const importantMessages = messages.filter(x => x.important === true);
        res.json(importantMessages);
    } catch (err) {
        next(err);
    }
});

router.post('/respond', authorizeAndExtractToken, authorizeRoles('admin', 'tehnical_support'), async (req, res, next) => {
    const body = JSON.parse(req.body);
    const {
        userId,
        response,
        originalMessage
    } = body;
  
    try {
        
        const fieldsToBeValidated = {
            userId: {
                value: userId,
                type: 'ascii'
            }
        };
    
        validateFields(fieldsToBeValidated);

        await MessagesService.sendResponseEmail(userId, response, originalMessage);
            
        res.status(200).json({
            msg: "Thank you for your message!",
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/', authorizeAndExtractToken, authorizeRoles('admin', 'tehnical_support'), async (req, res, next) => {
    try {
        await MessagesService.remove();
        res.json({msg: "All Messages deleted!"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin', "tehnical_support"), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {

        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });
        await MessagesService.removeById(id);
        res.json({msg: "Message removed!"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id/important', authorizeAndExtractToken, authorizeRoles('admin', "tehnical_support"), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {

        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });
        await MessagesService.setImportanceFlag(id);
        res.json({msg: "Message This message is critical now!"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});


module.exports = router;