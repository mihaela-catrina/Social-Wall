const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    subject: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    response: {
        type: String,
        default: ''
    },
    important: {
        type: Boolean,
        default: false
    },
    resolved: {
        type: Boolean,
        default: false        
    }
}, { timestamps: true });

const MessageModel = mongoose.model('Messages', MessageSchema);
module.exports = MessageModel;