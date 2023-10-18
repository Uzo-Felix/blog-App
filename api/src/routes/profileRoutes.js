const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateUser } = require('../middleware/authenticationMiddleware');

// Get user profile
router.get('/profile', authenticateUser, profileController.getProfile);

module.exports = router;
