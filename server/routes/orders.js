const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/orders - Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find().populate('restaurantId').sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/orders - Public (Place Order)
router.post('/', async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/orders/:id/status - Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
