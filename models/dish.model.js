const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    dish_name: {
        type: String,
        required: true
    },
    _id_category: {
        type: String,
        required: true
    },
    image_path: String,
    image_url: String,
    dish_price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Dish', dishSchema);
