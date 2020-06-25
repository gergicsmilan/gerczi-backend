const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(req.get('Authorization'), 'mysecretkey');
  } catch (err) {
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated!');
    error.statusCode = 401;
    throw error;
  }
  // user roles needed (admin, user) etc..
  req.userId = decodedToken.userId;
  next();
};
