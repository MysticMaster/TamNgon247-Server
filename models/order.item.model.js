const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    _id_order: {
        type: String,
        required: true
    },
    _id_dish: {
        type: String,
        required: true
    },
    price: Number,
    quantity: String,
    status: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderItem', orderItemSchema);