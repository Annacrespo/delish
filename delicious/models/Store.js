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

//set slug to slug input save will not happen until store is saved only runs when name is changed
storeSchema.pre('save', function(next){
    if (!this.isModified('name')) {
        next(); //skip it
        return; //stop function from running
    }
    this.slug = slug(this.name);
    next();
});
//TODO make it so slugs are unique

module.exports = mongoose.model('Store', storeSchema);