const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../Config/app.config');
const User = require('../Models/userModel.js');
const FileUpload = require('../Models/fileUpload.js')
const bcrypt = require('bcryptjs')
var ObjectId = require('mongoose').Types.ObjectId;
const path = require('path')
const multer = require('multer')

router.post('/uploadFile', (req, res) => {
    var fileName = ""
    var upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './Assets/Files/')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
                this.fileName = file.originalname
                const newFileUpload = new FileUpload({
                    speakerId: req.body.speakerId,
                    fileName: file.originalname
                })
                newFileUpload.save((saveError, docs) => {
                    if (saveError) {
                        res.json({
                            success: false,
                            msg: 'Cannot Upload File. File Upload Failed'
                        })
                    } else {}
                })
            }
        })
    }).any()

    upload(request, res, function (err) {
        if (!err) {
            res.json({
                success: true,
                msg: 'File Uploaded Successfully'
            })
        } else {
            res.json({
                success: false,
                msg: 'File Upload Failed. Try Again'
            });
        }
    })
})

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
                                html: '<b> Thanks for participating in TEW Workshop 2019. </b> <hr/> You have been selected to attend the workshop. Below are your credentials to access <a href="www.mepcoeng.ac.in">our online portal</a> <br/> Username : ' + newParticipant.username + '<br/>Passowrd : ' + req.body.password
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

router.post('/updatePassword', (req, res) => {
    if (!ObjectId.isValid(req.body.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.id}`);
    else {
        User.findById(req.body.id, (findError, foundUser) => {
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
                            message: hashError
                        })
                    } else {
                        bcrypt.compare(req.body.previousPassword, foundUser.password, (compareError, compareResult) => {
                            if (compareError) {
                                res.json({
                                    success: false,
                                    message: hashError
                                })
                            } else {
                                if (compareResult) {

                                    bcrypt.hash(req.body.newPassword, salt, (hashError, hash) => {
                                        if (hashError) {
                                            res.json({
                                                success: false,
                                                message: hashError
                                            })
                                        } else {
                                            User.findByIdAndUpdate(req.body.id, {
                                                $set: {
                                                    password: hash
                                                }
                                            }, (updateError, docs) => {
                                                if (updateError) {
                                                    res.json({
                                                        success: false,
                                                        message: updateError
                                                    })
                                                } else {
                                                    res.json({
                                                        succes: true,
                                                        message: 'Your password has been successfully changed'
                                                    })
                                                }
                                            })
                                        }
                                    });
                                } else {
                                    res.json({
                                        success: false,
                                        message: 'Your Previous password does not match!'
                                    })
                                }
                            }
                        })
                    }
                });
            }
        })
    }
});

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

router.get('/test', (req, res) => {
    res.send('Test Route!!!');
})

module.exports = router;