const bcrypt = require('bcryptjs');

const generateSalt = () => {
  return bcrypt.genSaltSync(10);
};

const hashPassword = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  generateSalt,
  hashPassword,
  comparePasswords,
};