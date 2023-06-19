const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = "kdidididiieiikde83"

app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://uzochukwu:FP6K6MRlZaAhSsdV@cluster0.lptnho9.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req, res) =>{
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

app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk) {
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) =>{
            if(err) throw err;
            res.cookie('token', token).json('ok');
        })
    }else {
        res.status(400).json('wrong credentials');
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (error, info) => {
        if (error) throw error;
        res.json(info);
    })
    res.json(req.cookies)
})

app.post('/logout', (req, res) => {
    res.cookie('token', "").json({
        id:userDoc._id,
        username
    });
})


app.listen(4000)