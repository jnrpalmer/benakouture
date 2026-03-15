const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'bena-kouture-secret',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, password and name required' });
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const user = new User({ email, password, name, isAdmin: false });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'bena-kouture-secret',
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, isAdmin: false } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
