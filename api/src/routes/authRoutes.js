const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authenticationMiddleware');

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Example of a protected route (authentication required)
router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
