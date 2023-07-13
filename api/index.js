const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const Post = require('./models/Post');

const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = "kdidididiieiikde83";

app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URI)

app.post('/api/register', async (req, res) =>{
    const {username, password} = req.body;
    try{
        const userDoc = User.create({
            username,
            password: bcrypt.hashSync(password,salt),
        });
        res.json({userDoc})
    }catch(error){
        res.status(400).json(error);
        console.log(error);
    }
});

app.post('/api/login', async (req, res)=>{
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk) {
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) =>{
            if(err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        })
    }else {
        res.status(400).json('wrong credentials');
    }
})

app.get('/api/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (error, info) => {
        if (error) throw error;
        res.json(info);
    })
})

app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/api/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    })
        res.json(postDoc);
    })

    

})

app.put('/api/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if(req.files){
        const {originalname, path} = req.files;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author of this post');
        }
        await postDoc.update({
            title,
            summary,
            content,
            cover: newPath? newPath : postDoc.cover,
        });
        res.json(postDoc);
    })
})

app.get('/api/post', async (req, res) => {
    res.json(
    await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});

app.get('/api/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

if(process.env.API_PORT){
    app.listen(process.env.API_PORT);
}
module.exports = app;