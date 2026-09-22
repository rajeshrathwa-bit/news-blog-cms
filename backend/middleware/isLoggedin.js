const jwt = require('jsonwebtoken');
const createError = require('../utils/error-message');

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(createError('Unauthorized', 401));
    }

    const tokenData = jwt.verify(token, process.env.JWT_SECRET);

    req.id = tokenData.id;
    req.role = tokenData.role;
    req.fullname = tokenData.fullname;

    next();
  } catch (error) {
    next(createError('Unauthorized', 401));
  }
};

module.exports = isLoggedIn;