const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const config = require('../config/config');

const s3 = new AWS.S3();

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: config.S3_REGION,
    credentials: {
      accessKeyId: config.S3_ACCESS_KEY,
      secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    },
  });

  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
      })
    );

    return `https://${config.bucket}.s3.amazonaws.com/${newFilename}`;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  uploadToS3,
};
