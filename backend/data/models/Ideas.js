const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        default:""
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
    },
    authority: {
        type: String,
        default: ""
    },
    tags: {
        type: Array,
        default: []
    },
    thumbUp: {
        type: Number,
        default: 0
    },
    thumbDown: {
        type: Number,
        default: 0
    },
    heart: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const IdeaModel = mongoose.model('Ideas', IdeaSchema);
module.exports = IdeaModel;