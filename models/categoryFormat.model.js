const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const categoryFormatSchema = new Schema({
    category_name: {
        type: String,
        minLength: 1,
        required: true,
        trim: true
    },
    platform_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    category_photo: {
        type: String,
        default: ""
    },
    pages: [mongoose.Schema.Types.ObjectId],
}, {
  timestamps: true,
});

const categoryFormat = mongoose.model('categoryFormat', categoryFormatSchema);

module.exports = categoryFormat;