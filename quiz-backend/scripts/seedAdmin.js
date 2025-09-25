// scripts/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const pass = process.env.SEED_ADMIN_PASS || 'Admin@123';
  let admin = await User.findOne({ email });
  if (admin) {
    console.log('Admin exists:', email);
    process.exit(0);
  }
  admin = new User({ name: 'Admin', email, role: 'admin' });
  await admin.setPassword(pass);
  await admin.save();
  console.log('Admin created:', email);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});



//node scripts/seedAdmin.js