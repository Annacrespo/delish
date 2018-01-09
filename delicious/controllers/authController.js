const passport = require('passport');

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
}