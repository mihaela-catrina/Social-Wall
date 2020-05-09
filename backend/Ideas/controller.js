const express = require('express');

const IdeasService = require('./services.js');
const {
    validateFields
} = require('../utils');

const {
    authorizeAndExtractToken
} = require('../security/Jwt');

const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const body = JSON.parse(req.body);
    const {
        userId,
        subject,
        description,
        authority,
        tags
    } = body;

    console.log(subject);
    console.log(userId);
    console.log(description);
    console.log(tags);
    console.log(authority);
  
    try {
        const fieldsToBeValidated = {
            userId: {
                value: userId,
                type: 'ascii'
            },
            subject: {
                value: subject,
                type: 'ascii'
            }
        };
    
        validateFields(fieldsToBeValidated);

        await IdeasService.postIdea(userId, subject, description, authority, tags);
            
        res.status(200).json({
            msg: "Thank you for your Idea!",
        });
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const ideas = await IdeasService.getAll();
        res.json(ideas);
    } catch (err) {
        next(err);
    }
});

router.put('/:id/levelup', async (req, res, next) => {
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
        await IdeasService.levelUp(id);
        res.json({msg: "You increased the priority of this idea!"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id/leveldown', async (req, res, next) => {
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
        await IdeasService.levelDown(id);
        res.json({msg: "You decresed the priority of this idea!"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id/heart', async (req, res, next) => {
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
        await IdeasService.heart(id);
        res.json({msg: "This idea must be awesome"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.delete('/', authorizeAndExtractToken, authorizeRoles('admin', 'tehnical_support'), async (req, res, next) => {
    try {
        await IdeasService.remove();
        res.json({msg: "All ideas deleted!"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;