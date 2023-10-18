const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const authService = require('../services/authService');

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = authService.generateSalt();
    const hashedPassword = authService.hashPassword(password, salt);

    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(404).json({ error: 'User not found' });
  }
  const passOk = authService.comparePasswords(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, config.secret, {}, (err, token) => {
      if (err) throw err;
      return res.status(200).cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    return res.status(401).json({ error: 'Wrong credentials' });
  }
};

const logout = (req, res) => {
  res.cookie('token', '').json('ok');
};

module.exports = {
  register,
  login,
  logout,
};
