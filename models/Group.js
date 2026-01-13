const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    pendingRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    inviteCode: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model("Group", groupSchema);