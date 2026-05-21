const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/menuitems?restaurantId=xxx - Public
router.get('/', async (req, res) => {
    try {
        const { restaurantId } = req.query;
        const filter = restaurantId ? { restaurantId } : {};
        const menuItems = await MenuItem.find(filter);
        res.json({ success: true, data: menuItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/menuitems - Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const menuItem = await MenuItem.create(req.body);
        res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT /api/menuitems/:id - Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "MenuItem not found" });
        }
        res.json({ success: true, data: menuItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE /api/menuitems/:id - Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "MenuItem not found" });
        }
        res.json({ success: true, data: menuItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
