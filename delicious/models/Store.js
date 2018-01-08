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
    photo: String

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
//TODO make it so slugs are unique

// storeSchema.pre('save', async function(next) {
//     if (!this.isModified('name')) {
//       next(); // skip it
//       return; // stop this function from running
//     }
//     this.slug = slug(this.name);
//     // find other stores that have a slug of wes, wes-1, wes-2
//     const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
//     const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
//     if (storesWithSlug.length) {
//       this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
//     }
//     next();
//     // TODO make more resiliant so slugs are unique
//    });
module.exports = mongoose.model('Store', storeSchema);