/*
    Author : Aravind S
    Date : 13-JANUARY-2019
    Description : This Model describes the Schema required to store an User in the Database
*/

// Module Imports
const mongoose = require('mongoose');
const config = require('../Config/app.config');
const pagination = require('mongoose-paginate');

//Schema for User
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userProfileName: {
        type: String,
        required: true
    },
    role: {
        type: String
    }
});

// Applies Pagination plugin for User Schema
UserSchema.plugin(pagination);

// Returns the requested page from User Database
module.exports.getAllUsers = (page, callback) => {
    Event.paginate({}, { limit: config.pagination.perPage, page: page }, callback);
}

// Exports the User Schema
const User = module.exports = mongoose.model('User', UserSchema);