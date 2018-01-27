const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    //if there is a failure where should it go
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'Successfully logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out 👋');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    //first check if user is authenticated

    if(req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'Oops, you must be logged in to view that!');
    res.redirect('/login');
}

exports.forgot = async(req, res) => {
    //check if user's email exists
    //send reset token and expiration
    //send email with token
    //redirect to login after email token

    const user = await User.findOne ({ email: req.body.email});
    if(!user) {
        req.flash('error', 'Password reset has been emailed to you');
        return res.redirect('/login');
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 360000; //1 hour from now
    await user.save();
    
}