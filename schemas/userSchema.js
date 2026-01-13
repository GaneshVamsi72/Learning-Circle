const Joi = require('joi');

module.exports.registerSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).required().unknown(false),
});

module.exports.loginSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }).required().unknown(false),
});