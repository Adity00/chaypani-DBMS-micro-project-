const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("Starting ChayPani Server...");
console.log("Target Database URI:", MONGO_URI ? MONGO_URI.replace(/\/\/.*@/, "//USER:PASSWORD@") : "UNDEFINED");

// Improve connection handling
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Wait 10 seconds for Atlas
        });
        console.log("✅ Connected to MongoDB Atlas successfully");

        // Only start the server after successful DB connection
        app.listen(PORT, () => {
            console.log(`🚀 ChayPani server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection error details:");
        console.error(err);
        process.exit(1); // Exit if cannot connect
    }
};

app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menuitems', require('./routes/menuItems'));
app.use('/api/orders', require('./routes/orders'));

// Health check endpoint
app.get('/', (req, res) => {
    res.send('ChayPani API is running');
});

connectDB();
