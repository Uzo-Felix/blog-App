module.exports = {
    secret: process.env.SECRET,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    bucket: process.env.BUCKET,
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 4000, // Port for the server
    allowedOrigins: [
    'http://localhost:3000',
    'https://blog-app-uzo-felix.vercel.app',
    'https://blog-app-m6t9.vercel.app',
    'https://felix-blog-3xwh9013v-uzo-felix.vercel.app',
  ],
  };
  