const express = require('express');
const router = express.Router();
const config = require('../Config/app.config');
const User = require('../Models/userModel.js');
var ObjectId = require('mongoose').Types.ObjectId;

router.post('/newParticipant', (req, res)=>{
    var password = 1;
    var newParticipant = new User({
        username: req.body.username,

    })
})

router.get('/test', (req, res)=>{
    res.send('Test Route!!!');
})

module.exports = router;