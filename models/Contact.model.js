const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    facebook: {
        type: String,
        required: true,
    },
    instagram: {
        type: String,
        required: true,
    },
    linkedin: {
        type: String,
        required: true,
    },
    youtube: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);