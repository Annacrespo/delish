const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy());

//login to passport and pass along user object

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());