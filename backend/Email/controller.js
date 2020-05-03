const {
    User
} = require('../data');
const sendEmail = require('./send')
const msgs = require('./msgs')
const templates = require('./templates')
const {
    Users
} = require('../data');

// The callback that is invoked when the user submits the form on the client.
const collectEmail = async (user, isNew) => {
    response = {};
    
    // We have a new user! Send them a confirmation email.
    if (isNew) {
        await sendEmail(user.email, templates.confirm(user._id))
        .then(() => response = { msg: msgs.confirm })
        .catch(err => console.log(err))
    }
  
    // We have already seen this email address. But the user has not
    // clicked on the confirmation link. Send another confirmation email.
    else if (user && !user.confirmed) {
        await sendEmail(user.email, templates.confirm(user._id))
        .then( () => response = { msg: msgs.resend })
    }
  
    // The user has already confirmed this email address
    else {
        response = { msg: msgs.alreadyConfirmed };
    }

    return response;
}

// The callback that is invoked when the user visits the confirmation
// url on the client and a fetch request is sent in componentDidMount.
const confirmEmail = async (req, res, next) => {
    try {

        console.log(req.params);
        const id = req.params.id;

        const user = await Users.findById(id);

        // A user with that id does not exist in the DB. Perhaps some tricky 
        // user tried to go to a different url than the one provided in the 
        // confirmation email.
        if (!user) {
            res.json({ msg: msgs.couldNotFind });
        }
            
        // The user exists but has not been confirmed. We need to confirm this 
        // user and let them know their email address has been confirmed.
        else if (user && !user.confirmed) {
            await Users.findByIdAndUpdate(id, { confirmed: true });
            res.json({ msg: msgs.confirmed });
        }

        // The user has already confirmed this email address.
        else  {
            res.json({ msg: msgs.alreadyConfirmed })
        }
        
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    collectEmail,
    confirmEmail
}