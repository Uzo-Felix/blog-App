const jwt = require('jsonwebtoken');
const config = require('../config/config');

const getProfile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, config.secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

module.exports = {
  getProfile,
};
