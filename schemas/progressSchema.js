const Joi = require("joi");

module.exports.progressSchema = Joi.object({
    progress: Joi.object({
        topic: Joi.string().min(3).max(20).required(),
        resource: Joi.string().min(3).max(150).required(),
        totalUnits: Joi.number().min(1).required(),
        completedUnits: Joi.number().min(0).max(Joi.ref('totalUnits')).required(),
        deadline: Joi.date().greater('now').required(),
    }).required().unknown(false),
});