/*
    Author : Aravind S
    Date : 13-JANUARY-2019
    Description : This Route handles the user actions and uploading of files by speakers and other admins
*/

// Module Imports
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs')
const multer = require('multer')
const jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;
var path = require('path')

// Application Configuration Import
const config = require('../Config/app.config');

// Model Imports
const User = require('../Models/userModel.js');
const FileUpload = require('../Models/fileUpload.js')

//Authenticates the User
router.post('/authenticate', (req, res) => {
    User.findOne({
        username: req.body.email_id
    }, (findError, foundUser) => {
        if (findError) {
            res.json({
                success: false,
                msg: {
                    userFound: false,
                    passwordMatch: false,
                    token: null,
                    desc: 'Database Error'
                }
            })
        } else {
            if (foundUser) {
                bcrypt.compare(req.body.password, foundUser.password, (compareError, compareResult) => {
                    if (compareError) {
                        res.json({
                            success: false,
                            msg: {
                                userFound: false,
                                passwordMatch: false,
                                token: null,
                                desc: 'Database Error'
                            }
                        })
                    } else {
                        if (compareResult) {
                            res.json({
                                success: true,
                                user: {
                                    name: foundUser.userProfileName,
                                    email_id: foundUser.username,
                                    id: foundUser._id,
                                    role: foundUser.role
                                },
                                msg: {
                                    userFound: true,
                                    passwordMatch: true,
                                    token: jwt.sign({
                                        data: foundUser
                                    }, config.application.secret, {
                                            expiresIn: 604800 // 1 week
                                        }),
                                    desc: 'You are successfully logged in'
                                }
                            })
                        } else {
                            res.json({
                                success: false,
                                msg: {
                                    userFound: true,
                                    passwordMatch: false,
                                    token: null,
                                    desc: 'Password is incorrect'
                                }
                            })
                        }
                    }
                })
            } else {
                res.json({
                    success: false,
                    msg: {
                        userFound: false,
                        passwordMatch: false,
                        token: null,
                        desc: 'Email ID is not Selected. Please verify'
                    }
                })
            }
        }
    })
})

// Handles file Upload and stores in the directory ../AssetsFiles


router.post('/uploadFile/:id', (request, res) => {
    var fileName = ""
    var upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './upload')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
                this.fileName = file.originalname;

                const newFileUpload = new FileUpload({
                    speakerId: req.params.id,
                    fileName: file.originalname
                })
                newFileUpload.save((saveError, docs) => {
                    if (saveError) {
                        res.json({
                            success: false,
                            msg: 'Cannot Upload File. File Upload Failed'
                        })
                    } else { }
                })
            }
        })
    }).any()
    upload(request, res, function (err) {
        if (!err) {
            res.json({
                error: false,
                msg: 'FIle Uploaded Successfully'
            })
        } else {
            res.json(err);
        }
    })
})


router.get('/files/:id',(req,res)=>{
    FileUpload.find({speakerId:req.params.id},(err,docs)=>{
        if(!err){
            res.send(docs);
        }
    })
});

router.get('/deleteFile/:id',(req,res)=>{
    FileUpload.findByIdAndRemove(req.params.id,(err,docs)=>{
        if(!err){
            res.json({
                success:true,
                msg: "File deleted successfully"
            })
        }
        else {
            res.json({
                success: false,
                msg: "Some error,while deleting the file"
            })
        }
    })
});


// Adds a new User to the Database by generating a hash with 10 rounds of salt generation
// and mails the user, the username and password needed to access the portal
router.post('/newParticipant', (req, res) => {
    var hashedPassword = '';
    bcrypt.genSalt(10, (saltError, salt) => {
        if (saltError) {
            res.json({
                success: false,
                message: saltError
            })
        } else {
            var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var randPassword = [...Array(6)].reduce(a => a + p[~~(Math.random() * p.length)], '');
            bcrypt.hash(randPassword, salt, (hashError, hash) => {
                if (hashError) {
                    res.json({
                        success: false,
                        message: hashError
                    })
                } else {
                    hashedPassword = hash;
                    var newParticipant = new User({
                        username: req.body.email_id,
                        password: hashedPassword,
                        userProfileName: req.body.userProfileName,
                        role: req.body.role
                    })
                    newParticipant.save((saveError, docs) => {
                        if (saveError) {
                            res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            var transporter = nodemailer.createTransport(config.mailCredentials);
                            var mailOptions = {
                                from: config.mailCredentials.auth.user,
                                to: newParticipant.username,
                                subject: 'TEW Workshop 2019 Reg.',
                                html: '<b> Thanks for participating in TEW Workshop 2019. </b> <hr/> You have been selected to attend the workshop. Below are your credentials to access <a href="www.mepcoeng.ac.in">our online portal</a> <br/> Username : ' + newParticipant.username + '<br/>Password : ' + randPassword
                            }
                            transporter.sendMail(mailOptions, (mailError, info) => {
                                if (mailError) {
                                    res.json({
                                        success: false,
                                        message: mailError
                                    })
                                } else {
                                    res.json({
                                        success: true,
                                        message: 'Participant Created successfully'
                                    })
                                }
                            })
                        }
                    });
                }
            });
        }
    });
})

//Updates the password of the user by comparing the current password hash and then updates the same
router.post('/updatePassword', (req, res) => {
    User.find({ username: req.body.email_id }, (findError, foundUser) => {
        if (findError) {
            res.json({
                success: false,
                message: hashError
            })
        } else {
            bcrypt.genSalt(10, (saltError, salt) => {
                if (saltError) {
                    res.json({
                        success: false,
                        message: saltError
                    })
                } else {
                    bcrypt.compare(req.body.oldPassword, foundUser[0].password, (compareError, compareResult) => {
                        if (compareError) {
                            res.json({
                                success: false,
                                message: compareError
                            })
                            console.log(compareError);
                        } else {
                            if (compareResult) {

                                bcrypt.hash(req.body.newPassword, salt, (hashError, hash) => {
                                    if (hashError) {
                                        res.json({
                                            success: false,
                                            message: hashError
                                        })
                                    } else {
                                        User.update({ username: req.body.email_id }, {
                                            $set: {
                                                password: hash
                                            }
                                        }, (updateError, docs) => {
                                            if (updateError) {
                                                res.json({
                                                    success: false,
                                                    message: updateError
                                                })
                                                console.log(updateError);
                                            } else {
                                                res.json({
                                                    success: true,
                                                    message: 'Your password has been successfully changed'
                                                })
                                            }
                                        })
                                    }
                                });
                            } else {
                                res.json({
                                    success: false,
                                    message: 'Your OLD password does not match!'
                                })
                            }
                        }
                    })
                }
            });
        }
    })
});

//Get all the participants list
router.get('/All/:role', (req, res) => {
    User.find({ role: req.params.role }, function (err, docs) {
        if (!err) {
            res.send(docs);
        }
    })
})


//Removes the participant from the Database
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
                    msg: 'Participant Removed Successfully'
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

// Testing Route used for checking random Stuff :P
router.get('/test', (req, res) => {
    res.send('Test Route!!!');
})

//Exports the route
module.exports = router;