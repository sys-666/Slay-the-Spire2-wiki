require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin user already exists, skipping...');
    } else {
      await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
      console.log('Admin user created: admin / admin123');
    }

    await mongoose.disconnect();
    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
