const {
  hash,
  compare
} = require('../security/Password');

const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MUSER}:${process.env.MPASSWORD}@${process.env.MHOST}:${process.env.MPORT}/${process.env.MDATABASE}?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
  } catch (e) {
    console.trace(e);
  }
})();

const Users = require('./models/Users.js');
const Messages = require('./models/Messages.js');
const Ideas = require('./models/Ideas.js');


(async () => {
  try {
    const existingUser = await Users.findOne({ username: "admin" });
    if (!existingUser) {
        const hashedPassword = await hash("admin");
        const user = new Users({
            role: "admin",
            email: "admin@gmail.com",
            firstName: "Admin",
            lastName: "Default",
            username: "admin",
            password: hashedPassword,
            confirmed: true
        });
        await user.save();
    }
    
  } catch (e) {
    console.trace(e);
  }
})();

module.exports = {
  Users,
  Messages,
  Ideas
}