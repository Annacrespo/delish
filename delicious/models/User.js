const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; //tells to use es6 promise in each model to supress error of deprecated promise
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-db-errors');
const passportLocalMongoose = require('password-local-mongoose');

//model is what data will look like

const userSchema = newSchema ({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [
            validator.isEmail,
            'Invalid Email Address'
        ]
    },
    name: {

    }
});

module.exports = mongoose.model('User', userSchema)