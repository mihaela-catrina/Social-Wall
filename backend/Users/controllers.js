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

const {
    confirmEmail
} = require('../Email/controller')

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const body = JSON.parse(req.body);
    const {
        role,
        email,
        firstName,
        lastName,
        username,
        password
    } = body;

    // validare de campuri
    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'ascii'
            },
            firstName: {
                value: firstName,
                type: 'alpha'
            },
            lastName: {
                value: lastName,
                type: 'alpha'
            },
            password: {
                value: password,
                type: 'ascii'
            }
        };
        validateFields(fieldsToBeValidated);
        response = await UsersService.add(role, email, firstName, lastName, username, password);
       
        res.json(response);
        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});


router.post('/register/support', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const body = JSON.parse(req.body);
    const {
        role,
        username,
        password
    } = body;

    // validare de campuri
    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'ascii'
            },
            password: {
                value: password,
                type: 'ascii'
            }
        };
        validateFields(fieldsToBeValidated);
        await UsersService.addSupport(role, username, password);
       
        res.json({msg: "You've added a new tehnical guy!"})
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

router.delete('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        const users = await UsersService.remove();
        res.json(users);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        const users = await UsersService.removeById(id);
        res.json(users);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/pending', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const users = await UsersService.getPending();
        res.json(users);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/pending/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {
        const resp = await UsersService.approve(id);
        res.json(resp);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin', "tehnical_support"), async (req, res, next) => {
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
              type: 'ascii'
          },
          password: {
              value: password,
              type: 'ascii'
          }
      };
  
      validateFields(fieldsToBeValidated);
    
      const resp = await UsersService.checkConfirmedAccount(username);

    if (resp.status) {
        const {user, token} = await UsersService.authenticate(username, password);
        res.status(200).json({
                msg: "Success",
                confirmed: true,
                id: user.id,
                username: user.username,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: token
        });
    } else {
        console.log(resp.role)
        if (resp.role === 'local-authority') {
            res.status(200).json({
                msg: "Your request is not verified yet!",
                confirmed: false
            });
        } else {
            res.status(200).json({
                msg: "You have not confirmed your email!",
                confirmed: false
            });
        }
    }
  } catch (err) {
      // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
      next(err);
  }

})


// This is the endpoint that is hit from the onSubmit handler in Landing.js
// The callback is shelled off to a controller file to keep this file light.

// this is the endpoint pinged in the componentDidMount of 
// Confirm.js on the client.
router.get('/confirm/:id', confirmEmail, async (req, res, next) => {next()});

module.exports = router;