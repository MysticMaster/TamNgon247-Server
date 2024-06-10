const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id_customer: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    house_number: String,
    city: {
        type: String,
        required: true
    },
    payment: Boolean,
    status: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
