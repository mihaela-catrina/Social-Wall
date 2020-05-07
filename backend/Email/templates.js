const { CLIENT_ORIGIN } = require('../config')

// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {

  confirm: id => ({
    subject: 'Social Wall Confirm Email',
    html: `
      <div>
        <h3> Welcome! We are happy to have you here </h3>
        <h4> Please confirm your email! </h4>
        <a href='${CLIENT_ORIGIN}/confirm?id=${id}'>
          click to confirm email
        </a>
        <br />
        <br />
        <h4> Thanks! </h4>
        <h2> Social Wall Bot </h2>
        <img src="https://media-exp1.licdn.com/dms/image/C4D1BAQHbgUhG8SK2jA/company-background_10000/0?e=2159024400&v=beta&t=OPRImA_UOMldIC1NrcXRa-TPtXV5j7X0YvhqcUearIA" alt="img" height="200" width="900"/>
      </div>
    `,      
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm?id=${id}}`
  }),

  response: content => ({
    subject: 'Social Wall Response',
    html: `
      <div>
        <h3> Your original message: ${content.originalMsg.subject} </h3>
        <p> ${content.originalMsg.message} </p>

        <br />
        <br />

        <h3> Social Wall Response: </h3>
        <p> ${content.responseMsg} </p>
        <img src="https://media-exp1.licdn.com/dms/image/C4D1BAQHbgUhG8SK2jA/company-background_10000/0?e=2159024400&v=beta&t=OPRImA_UOMldIC1NrcXRa-TPtXV5j7X0YvhqcUearIA" alt="img" height="200" width="900"/>
        </div>
    `,
    text: content.responseMsg
  })
  
}