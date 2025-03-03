const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Import the User model

require('dotenv').config(); // Load the secret key from .env

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; // Attach user ID to the request object

        // Fetch the user details (like username) from the database
        User.findById(req.user)
            .then(user => {
                if (!user) {
                    return res.status(400).json({ message: 'User not found' });
                }
                req.username = user.username; // Attach username to request object
                next(); // Proceed to the next middleware
            })
            .catch(err => {
                res.status(500).json({ message: 'Error fetching user details', error: err.message });
            });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
