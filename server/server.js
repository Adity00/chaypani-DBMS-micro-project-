const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menuitems', require('./routes/menuItems'));
app.use('/api/orders', require('./routes/orders'));

app.listen(PORT, () => {
    console.log(`ChayPani server running on port ${PORT}`);
});
