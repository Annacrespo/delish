const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else{
            next({message: 'That file type isn\'t allowed'}, false)
        }
    }
}
//multer will handle the upload request and where to photo will be placed and type
const jimp = require('jimp'); //allows manipulation of image
const uuid = require('uuid'); // creates unique identifiers
exports.homePage = (req, res) => {
    res.render('index'); //render index.js
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'add Store'});
}

exports.upload = multer(multerOptions).single('photo');
//accept a single file with the name photo and store in req.photo

exports.resize = async(req, res, next) => {
    //middleware will save image and pass along to create store
    //check if there is no new file to resize
    if (!req.file) {
        next();
        return; //stops function
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    //now we resize 
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    //once photo is written to file system keep going
    next();
}

exports.createStore = async (req, res) => {
    req.body.author = req.user._id; //takes the id of the current user and puts in the author field
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

const confirmOwner = (store, user) => {
    if(!store.author.equals(user._id)) {
        throw Error('You need to own this store in order to edit it.')
    }
}
exports.editStore = async(req, res) => {
    //find the store given the id
    // res.json(req.params);
    const store = await Store.findOne({ _id: req.params.id });
    //returns a promise use await to return back from database

    //confirm they are the owner of the store
    confirmOwner(store, req.user);
    //render out the edit form so that the user can update their store
    res.render('editStore', {title: `edit: ${store.name}`, store});
}

exports.updateStore = async(req, res) => {
    //find and update the store
    //findOneAndUpdate takes in 3 parameters query, data, and options
    //pass over req.body object with every form field
    //set location data to be a point
    req.body.location.type = 'Point';
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
//use multer to upload the file and gimp to resize the file

exports.getStoreBySlug = async(req, res, next) => {
    //query database
    const store = await Store.findOne({ slug: req.params.slug }).populate('author');

    if(!store) return next();
    res.render('store', {store, title: store.name});
};

exports.getStoresByTag = async(req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || {$exists: true};
    const tagsPromise = Store.getTagsList();
    const storePromise = Store.find({ tags: tagQuery})
    //find all of the store tag properties
    const [tags, stores] = await Promise.all([tagsPromise, storePromise]);
    //use Promise.all and await all from returning

    res.render('tags', { tags , title: 'Tags', tag, stores});
}

exports.searchStores = async(req, res) => {
    const stores = await Store
    .find({
        $text: {
            $search: req.query.q
        },
    }, {
        score: {$meta: 'textScore'}, 
    })
    //sort them
    .sort({
        score: {$meta: 'textScore'}
    })
    //limit only to 5
    .limit(5)
    res.json(stores);
    };