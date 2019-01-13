/*
    Author : Aravind S
    Date : 13-JANUARY-2019
    Description : This Model describes the Schema required to store an User in the Database
*/

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

UserSchema.plugin(pagination);
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAllUsers = (page, callback) => {
    Event.paginate({}, { limit: config.pagination.perPage, page: page }, callback);
}
