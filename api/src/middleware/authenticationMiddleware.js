const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, config.secret, {}, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // You can access the user's information in the 'decoded' object.
    // For example, 'decoded.username' or 'decoded.id'.

    next();
  });
};

module.exports = {
  authenticateUser,
};
