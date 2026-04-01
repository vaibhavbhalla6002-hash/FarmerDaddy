const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const admin = require('../firebase-admin');

// Traditional Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    console.error('Signup Error:', err);
    next(err);
  }
});

// Traditional Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login Error:', err);
    next(err);
  }
});

// Logout (Frontend clears token)
router.get('/logout', (req, res) => {
  res.json({ message: 'Successfully logged out' });
});

// Google Signup / Login
router.post('/google', async (req, res, next) => {
  const { idToken } = req.body;
  if (!admin) {
    return res.status(500).json({ message: 'Firebase Admin not initialized. Check server logs.' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId: uid });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, picture } });
  } catch (err) {
    console.error('Google Auth Error:', err);
    next(err);
  }
});

module.exports = router;
