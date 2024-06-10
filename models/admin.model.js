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
    image_path: String,
    image_url: String,
    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', customerSchema);
