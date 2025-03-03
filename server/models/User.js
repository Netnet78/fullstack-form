const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password is not modified
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password); // Compare and return boolean
};

module.exports = mongoose.model('User', userSchema); // Export the model
