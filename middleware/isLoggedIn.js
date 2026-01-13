const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
    if (!req.session.userId) {
        throw new AppError('You must be logged in', 403);
    }
    next();
};