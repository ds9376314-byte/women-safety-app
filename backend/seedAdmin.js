const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdminUser = require('./models/AdminUser');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin exists
    const existingAdmin = await AdminUser.findOne({ email: 'ds9376314@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit();
    }

    const admin = new AdminUser({
      name: 'Super Admin',
      email: 'ds9376314@gmail.com',
      password: '197720012006',
      role: 'SUPER_ADMIN'
    });

    await admin.save();
    console.log('Admin seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
