const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/config/config');

mongoose.connect(config.mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the server after successful database connection
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });
