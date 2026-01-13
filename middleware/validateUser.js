const { registerSchema, loginSchema } = require('../schemas/userSchema');
const AppError = require('../utils/AppError');

module.exports.validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);

    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);
    next();
};

module.exports.validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);

    if (error) throw new AppError(error.details.map(e => e.message).join(', '), 400);
    next();
};