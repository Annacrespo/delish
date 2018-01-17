const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; //tells to use es6 promise in each model to supress error of deprecated promise
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

//model is what data will look like

const userSchema = new mongoose.Schema ({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [
            validator.isEmail,
            'Invalid Email Address'
        ],
        required: 'Please supply email address'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.virtual('gravatar').get(function(){
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email' });
//adds methods and fields needed for authentication for schema, email is login field
userSchema.plugin(mongodbErrorHandler);
//simplifies errors


module.exports = mongoose.model('User', userSchema)