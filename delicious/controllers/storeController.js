const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index'); //render index.js
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'add Store'});
}

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    //success, warning, or info
    res.redirect(`/store/${store.slug}`);
    }

exports.getStores = async(req, res) => {
    //query database for list of all stores
    const stores = await Store.find();
    res.render('stores', {title: 'Stores', stores});
}

exports.editStore = async(req, res) => {
    //find the store given the id
    // res.json(req.params);
    const store = await Store.findOne({ _id: req.params.id });
    //returns a promise use await to return back from database

    //confirm they are the owner of the store
    //render out the edit form so that the user can update their store
    res.render('editStore', {title: `edit: ${store.name}`, store});
}

exports.updateStore = async(req, res) => {
    //find and update the store
    //findOneAndUpdate takes in 3 parameters query, data, and options
    //pass over req.body object with every form field
    const store = await Store.findOneAndUpdate({_id: req.params.id }, req.body, 
        {
            new:true, 
            runValidators: true
        }).exec();
    //new:true returns new store instead of old one
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -></a>`);
    res.redirect(`/stores/${store.id}/edit`);
    //redirect to store and alert if worked


}