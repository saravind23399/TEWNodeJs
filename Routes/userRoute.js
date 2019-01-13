const express = require('express');
const router = express.Router();
const config = require('../Config/app.config');
const User = require('../Models/userModel.js');
const bcrypt = require('bcryptjs')
var ObjectId = require('mongoose').Types.ObjectId;

router.post('/newParticipant', (req, res) => {
    var hashedPassword = '';
    bcrypt.genSalt(10, (saltError, salt) => {
        if (saltError) {
            res.json({
                success: false,
                message: saltError
            })
        } else {
            bcrypt.hash(req.body.password, salt, (hashError, hash) => {
                if (hashError) {
                    res.json({
                        success: false,
                        message: hashError
                    })
                } else {
                    hashedPassword = hash;
                    var newParticipant = new User({
                        username: req.body.username,
                        password: hashedPassword,
                        userProfileName: req.body.userProfileName,
                        role: 'Participant'
                    })
                    newParticipant.save((err, docs) => {
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            res.json({
                                success: true,
                                message: 'Participant Created successfully'
                            })
                        }
                    });
                }
            });
        }
    });
})

router.post('/updatePassword', (req, res) => {
    if (!ObjectId.isValid(req.body.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.id}`);
    else {
        bcrypt.hash(req.body.password, salt, (hashError, hash) => {
            if (hashError) {
                res.json({
                    success: false,
                    message: hashError
                })
            } else {
                User.findByIdAndUpdate(req.body.id, {
                    $set: {
                        
                    }
                })
            }
        });
    }
})

router.post('/removeParticipant', (req, res) => {
    if (!ObjectId.isValid(req.body.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.id}`);
    else {
        User.findByIdAndRemove({
            _id: req.body.id
        }, (err, doc) => {
            if (!err) {
                res.json({
                    success: true,
                    msg: 'User Participant'
                });
            } else {
                res.json({
                    success: false,
                    msg: "Error in deleting Participant"
                });
            }
        });
    }
})

router.get('/test', (req, res) => {
    res.send('Test Route!!!');
})

module.exports = router;