const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const s3Service = require('../services/s3Service');

const createPost = async (req, res) => {
  let filePath = null;
  if (req.file) {
    const { originalname, path, mimetype } = req.file;
    filePath = await s3Service.uploadToS3(path, originalname, mimetype);
  }

  const { token } = req.cookies;
  jwt.verify(token, config.secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: filePath,
      author: info.id,
    });
    res.json(postDoc);
  });
};

const updatePost = async (req, res) => {
  let filePath = null;
  if (req.file) {
    const { originalname, path, mimetype } = req.file;
    filePath = await s3Service.uploadToS3(path, originalname, mimetype);
  }

  const { token } = req.cookies;
  jwt.verify(token, config.secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: filePath ? filePath : postDoc.cover,
    });

    res.json(postDoc);
  });
};

const listPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  listPosts,
  getPostById,
};
