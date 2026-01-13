const Joi = require('joi');

module.exports.groupSchema = Joi.object({
    group: Joi.object({
        name: Joi.string().min(3).required(),
    }).required().unknown(false),
});

module.exports.groupUpdateSchema = Joi.object({
    group: Joi.object({
        name: Joi.string().min(3).required(),
    }).required().unknown(false),
});