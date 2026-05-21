const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const email = "admin@chaypani.com";
        const password = "adminpassword123";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Admin user already exists!");
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new User({
            name: "Master Admin",
            email,
            password: hashedPassword,
            role: "admin"
        });

        await admin.save();
        console.log("✅ Admin user created successfully!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
