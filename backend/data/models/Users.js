const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user', 'tehnical_support']
    },
    email: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const UserModel = mongoose.model('Users', UserSchema);
module.exports = UserModel;