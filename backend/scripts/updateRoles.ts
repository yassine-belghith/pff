import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';

dotenv.config();

(async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pfe_app';

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Ensure every document has a role; default to 'user' if missing
    const resMissing = await User.updateMany({ role: { $exists: false } }, { $set: { role: 'user' } });
    console.log(`Added default role to ${resMissing.modifiedCount} docs without role.`);

    // 2. Fix any invalid role values
    const allowed = ['user', 'worker', 'admin'];
    const resInvalid = await User.updateMany({ role: { $nin: allowed } }, { $set: { role: 'user' } });
    console.log(`Fixed ${resInvalid.modifiedCount} docs that had invalid role values.`);

    // 3. Optionally promote a specific account to admin via ENV var
    if (process.env.ADMIN_EMAIL) {
      const resAdmin = await User.updateOne(
        { email: process.env.ADMIN_EMAIL },
        { $set: { role: 'admin' } }
      );
      console.log(`Promoted ${resAdmin.modifiedCount} account(s) with ADMIN_EMAIL to admin role.`);
    }

    // 4. Create index on role (no-op if already exists)
    await User.collection.createIndex({ role: 1 });
    console.log('Ensured index on role.');
  } catch (err) {
    console.error('Error updating roles:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
})();
