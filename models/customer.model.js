const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone: String,
    ward: String,
    street: String,
    house_number: String,
    city: String,
    image_path: String,
    image_url: String,
    status: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
