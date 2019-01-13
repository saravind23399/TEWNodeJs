/*
    Author : Aravind S
    Date : 13-JANUARY-2019
    Description : This Model describes the Schema required to depict File Uploads by Speakers and convenors
*/

const mongoose = require('mongoose');
const pagination = require('mongoose-paginate');
var ObjectId = require('mongoose').Types.ObjectId;

//Schema for User
const FileUploadSchema = mongoose.Schema({
    speakerId:{
        type: String,
        required: true
    },
    fileName:{
        type: String,
        required: true
    }
});

FileUploadSchema.plugin(pagination);
const FileUpload = module.exports = mongoose.model('FileUpload', FileUploadSchema);
