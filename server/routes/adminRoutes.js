const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to create admin (only for first time)
//router.post('/register', async (req, res) => {
//    const { username, password } = req.body;
//    try {
//       const admin = new Admin({ username, password });
//        await admin.save();
//        res.status(201).json({ message: 'Admin registered' });
//    } catch (error) {
//        res.status(500).json({ message: 'Server error' });
//    }
//});

// Middleware
const protect = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

router.get('/dashboard', protect, (req, res) => {
    res.json({ message: 'Welcome to the Dashboard' });
});


module.exports = router;

