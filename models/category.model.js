const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    image_path: String,
    image_url: String,
    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
