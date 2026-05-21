const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/restaurants - Public
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json({ success: true, data: restaurants });
    } catch (error) {
        console.error("GET /api/restaurants error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/restaurants/:id - Public
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.error("GET /api/restaurants/:id error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/restaurants - Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        console.error("POST /api/restaurants error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/restaurants/:id - Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.error("PUT /api/restaurants/:id error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE /api/restaurants/:id - Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.error("DELETE /api/restaurants/:id error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
