const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const fs = require('fs');

app.use(express.urlencoded({ extended: false }));
app.use(cors({credentials:true,origin:['http://localhost:3000', 'https://blog-app-uzo-felix.vercel.app/', 'https://blog-app-m6t9.vercel.app/', 'https://felix-blog-3xwh9013v-uzo-felix.vercel.app/']}));
// app.use(cors())
app.use(express.json());
app.use(cookieParser());
const http = require('http');
const server = http.createServer(app);

const s3 = new AWS.S3();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;
const bucket = 'felix-blog-app'

// app.use('/uploads', express.static(__dirname + '/uploads'));
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 4000;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');

    server.listen(port, () => {
      console.log(`Server is running on  port ${port}`)
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  })

const upload = multer({
  storage: multerS3({
    s3,
    bucket: bucket,
    acl: 'public-read',
    metadata: function (req, file, cb){
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb){
      cb(null, Date.now().toString())
    }
  })
});

async function uploadToS3(path, originalFilename, mimetype){
    const client = new S3Client({
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`
}

app.post('/api/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/api/login', async (req,res) => {
  const {username,password} = req.body;

  // try{
    const userDoc = await User.findOne({username});
    if(!userDoc){
      return res.status(404).json({error: 'User not found'});
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      jwt.sign({username,id:userDoc._id}, secret, {}, (err, token) =>{
        if(err) throw err;
        return res.status(200).cookie('token', token).json({
          id:userDoc._id,
          username,
        });
      }
        );
    } else {
      return res.status(401).json({error: 'Wrong credentials'});
    }
  // } catch (error){
  //   return res.status(500).json({error: 'Internal server error'})
  // }
});

app.get('/api/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/api/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/api/post', upload.single('file'), async (req,res) => {
  let filePath = null;
  if (req.file) {
    const {originalname,path, mimetype} = req.file;
    filePath = await uploadToS3(path, originalname, mimetype);
  }
  
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:filePath,
      author:info.id,
    });
    res.json(postDoc);
  });
  
});

app.put('/api/post',upload.single('file'), async (req,res) => {
  let filePath = null;
  if (req.file) {
    const {originalname,path, mimetype} = req.file;
    filePath = await uploadToS3(path, originalname, mimetype);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: filePath ? filePath : postDoc.cover,
    });

    res.json(postDoc);
  });

});

app.get('/api/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/api/post/:id', async (req, res) => {
  const {id} = req.params;
  try{
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  } catch (err){
    console.log(err);
  }
})

//