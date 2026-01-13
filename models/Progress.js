const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },

    topic: {
        type: String,
        trim: true,
        required: true
    },

    resource: {
        type: String,
        trim: true,
        required: true
    },

    totalUnits: {
        type: Number,
        required: true,
    },

    completedUnits: {
        type: Number,
        default: 0
    },

    deadline: {
        type: Date, 
        required: true,
    },

    lastUpdated: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Progress", progressSchema);