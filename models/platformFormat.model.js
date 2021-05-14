const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const platformFormatSchema = new Schema({
    plat_name: {
        type: String,
        minLength: 1,
        required: true,
        trim: true
    },
    owner: {
        type: String,
        required: true
    },
    //unsure if we want platforms to still be public private 
    is_public: {
        type: Boolean, 
        required:  function() {
            return this.is_published == true;
        }
    }, 
    privacy_password: { 
        type: String, 
        required: function() {
            return this.is_public == false;
        }
    },  
    cover_photo: {
        type: String,
        default: ""
    },
    //storing categories for each platform
    categories: [mongoose.Schema.Types.ObjectId],
    is_published: {
        type: Boolean,
        default: false,
        required: true
    },
    times_played: {
        type: Number,
        default: 0
    },
    pages_length:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const PlatformFormat = mongoose.model('PlatformFormat', platformFormatSchema);

module.exports = PlatformFormat;