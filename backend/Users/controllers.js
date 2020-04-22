const express = require('express');

const UsersService = require('./services.js');
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

router.post('/register', async (req, res, next) => {
    const {
        username,
        password,
        role
    } = req.body;

    // validare de campuri
    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'alpha'
            },
            password: {
                value: password,
                type: 'ascii'
            }
        };
        validateFields(fieldsToBeValidated);
        await UsersService.add(username, password, role);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        const users = await UsersService.getAll();
        res.json(users);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
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
        const user = await UsersService.getById(id);
        res.json(user);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    const body = JSON.parse(req.body);
    const {
        username,
        password
    } = body;
  
    try {
      const fieldsToBeValidated = {
          username: {
              value: username,
              type: 'alpha'
          },
          password: {
              value: password,
              type: 'ascii'
          }
      };
  
      validateFields(fieldsToBeValidated);
  
      const {user, token} = await UsersService.authenticate(username, password);
  
      res.status(200).json({
            id: user.id,
            username: user.username,
            role: user.role,
            token: token
      });
  } catch (err) {
      // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
      next(err);
  }

})
module.exports = router;