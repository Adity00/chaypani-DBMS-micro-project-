const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String },
    address: { type: String },
    phone: { type: String },
    isOpen: { type: Boolean, default: true }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
