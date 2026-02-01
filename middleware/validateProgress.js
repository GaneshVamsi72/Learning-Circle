const { progressSchema } = require('../schemas/progressSchema');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
    const { value, error } = progressSchema.validate(req.body, {
        convert: true,
        abortEarly: false
    });

    if (error) {
        throw new AppError(error.details.map(e => e.message).join(', '), 400);
    }

    req.body = value;

    next();
};