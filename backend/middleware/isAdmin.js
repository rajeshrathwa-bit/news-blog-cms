const createError = require('../utils/error-message');

const isAdmin = (req, res, next) => {
  if (req.role === 'admin') {
    return next();
  }
  next(createError('Forbidden', 403));
};

module.exports = isAdmin;