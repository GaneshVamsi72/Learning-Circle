const { groupUpdateSchema } = require('../schemas/groupSchema');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
    const { error } = groupUpdateSchema.validate(req.body);
    if (error) {
        throw new AppError(error.details.map(e => e.message).join(', '), 400);
    }

    next();
};