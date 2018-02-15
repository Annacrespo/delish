const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// promise to use is global.Promise when querying database we use es6 promise
const slug = require('slugs');
//url friendly names for slugs

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: {
        type: String,
        default: 'Point',

        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates'
        }],
        address: {
            type: String,
            required: 'You must supply an address'
        }
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }

});
//define our indexes
storeSchema.index({
    name: 'text',
    description: 'text'
});

// set slug to slug input save will not happen until store is saved only runs when name is changed
storeSchema.pre('save', async function(next){
    if (!this.isModified('name')) {
        next(); //skip it
        return; //stop function from running
    }
    this.slug = slug(this.name);
    //find stores with same slug
    const slugRegEx = new RegExp(`(^${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({slug: slugRegEx });
    //use this.constructor to access model within model function which is equivalent to Store.find()
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags'},
        //$tags field on document that wants to unwind
        { $group: { _id: '$tags', count: { $sum: 1 } }},
        //each time grouped add one to count
        { $sort: { count: -1 } }
    ]);
    //aggregate will take an array of possibile results
}

module.exports = mongoose.model('Store', storeSchema);