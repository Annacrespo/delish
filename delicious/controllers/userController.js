const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
    res.render('login', {title: 'Login'});
}

exports.registerForm = (req, res) => {
    res.render('register', {title: 'Register'});
}

//make a middleware to check if user registration is valid
exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    //exposes methods for validating through express
    req.checkBody('name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'That is not a valid email').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Confirmed password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'Oops! your passwords do not match!').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        //prevents form from refreshing completely when there is an error
        res.render('register', {title: 'Register', body: req.body, flashes: req.flash() })
        return; //stop the function from running
    }
    next();//there were no errors

};