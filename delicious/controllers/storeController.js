const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index'); //render index.js
    console.log(req.name);

}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'add Store'});
}

exports.createStore = (req, res) => {
    res.json(req.body);
}