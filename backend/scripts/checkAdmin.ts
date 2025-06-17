import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';

dotenv.config();

(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pfe_app';
  await mongoose.connect(uri);
  const admin = await User.findOne({ email: 'admin@admin.com' }).select('+password');
  if (!admin) {
    console.log('⛔  No admin document found');
  } else {
    const match = await bcrypt.compare('admin', admin.password);
    console.log('✅  Admin found. Password matches:', match);
    console.log('Role:', admin.role);
  }
  await mongoose.disconnect();
})();
