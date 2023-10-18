const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');

app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: config.allowedOrigins,
}));
app.use(express.json());
app.use(cookieParser());

// Set up routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/profile', profileRoutes);

module.exports = app; // Export the 'app' object
