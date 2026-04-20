const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    customerAddress: { type: String },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    restaurantName: { type: String },
    items: [{ name: String, price: Number, quantity: Number }],
    totalAmount: { type: Number },
    status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
