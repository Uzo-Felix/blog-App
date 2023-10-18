const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateUser } = require('../middleware/authenticationMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Create a post
router.post('/', authenticateUser, upload.single('file'), postController.createPost);

// Update a post
router.put('/', authenticateUser, upload.single('file'), postController.updatePost);

// List all posts
router.get('/', postController.listPosts);

// Get a post by ID
router.get('/:id', postController.getPostById);

module.exports = router;
