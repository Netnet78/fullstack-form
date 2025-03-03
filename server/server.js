require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/authMiddleware'); // Import middleware
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000; 
const MONGO_URI = process.env.MONGO_URI; 
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));


// Middleware
app.use(express.json()); // Parse JSON request body
app.use(express.static(path.join(__dirname, 'dist')));


// Route: Home (Test API)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "dist"))
});


// Signup Route (POST)
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save(); // Save user to database

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});


// Login Route (POST)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Protected Route Example (Only accessible with valid JWT)
app.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome user ${req.username}! This is a protected route.` });
});


// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
