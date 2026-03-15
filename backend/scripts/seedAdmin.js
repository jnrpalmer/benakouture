require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bena-kouture';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const existing = await User.findOne({ email: 'admin@benakouture.com' });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
    return;
  }
  await User.create({
    email: 'admin@benakouture.com',
    password: 'admin123',
    name: 'Admin',
    isAdmin: true
  });
  console.log('Admin user created: admin@benakouture.com / admin123');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
