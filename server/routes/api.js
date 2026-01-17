const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Car = require('../models/Car');
const Enquiry = require('../models/Enquiry');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// --- Helpers ---

// Async Handler to remove try-catch boilerplate
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error(err);
        res.status(500).json({ message: err.message });
    });

// Auth Middleware - Check if user is logged in
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token required' });
    
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Admin Middleware - Check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Email Transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendEmail = (to, subject, text) => {
    transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text },
        (err, info) => err ? console.log('Email Error:', err) : console.log('Email Sent:', info.response));
};

// --- AUTH ROUTES ---

// POST login
router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare hashed passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        }
    });
}));

// POST logout
router.post('/logout', asyncHandler(async (req, res) => {
    // Since we're using stateless authentication (no sessions),
    // logout is handled on the client side by clearing tokens/sessions
    res.json({ message: 'Logout successful' });
}));

// --- CARS ROUTES ---

// GET all cars (with filters)
router.get('/cars', asyncHandler(async (req, res) => {
    const { make, status } = req.query;
    const query = {
        ...(make && { make: new RegExp(make, 'i') }),
        ...(status && { status })
    };
    res.json(await Car.find(query));
}));

// GET single car
router.get('/cars/:id', asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
}));

// POST new car - PROTECTED (ADMIN only)
router.post('/cars', auth, adminOnly, asyncHandler(async (req, res) => {
    res.status(201).json(await new Car(req.body).save());
}));

// PUT update car - PROTECTED (ADMIN only)
router.put('/cars/:id', auth, adminOnly, asyncHandler(async (req, res) => {
    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
}));

// DELETE car - PROTECTED (ADMIN only)
router.delete('/cars/:id', auth, adminOnly, asyncHandler(async (req, res) => {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted' });
}));

// --- ENQUIRY ROUTES ---

// POST create enquiry
router.post('/enquire', asyncHandler(async (req, res) => {
    console.log("enquiry created");
    res.status(201).json(await new Enquiry(req.body).save());
}));

// GET all enquiries - PROTECTED
router.get('/enquiries', auth, asyncHandler(async (req, res) => {
    res.json(await Enquiry.find().populate('carId'));
}));

// POST reply to enquiry - PROTECTED (ADMIN only)
router.post('/admin/reply', auth, adminOnly, asyncHandler(async (req, res) => {
    const { enquiryId, replyMessage } = req.body;
    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    enquiry.adminReply = replyMessage;
    enquiry.status = 'Replied';
    await enquiry.save();
    res.json({ message: 'Reply sent', enquiry });
}));

module.exports = router;
