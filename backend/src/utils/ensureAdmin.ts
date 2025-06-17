import dotenv from 'dotenv';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

/**
 * Ensures that a default admin account exists in the database. The credentials
 * can be provided via environment variables; otherwise sensible defaults are
 * used. The password will be hashed automatically by the User pre-save hook.
 */
export const ensureAdmin = async (): Promise<void> => {
  const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const name = process.env.ADMIN_NAME || 'Administrator';

  // Check if an admin with that email already exists
  const existingAdmin = (await User.findOne({ email }).select('+password')) as IUser | null;
  if (existingAdmin) {
    let updated = false;

    // Ensure role is admin
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      updated = true;
    }

    // Ensure password matches desired one
    const passwordMatches = await bcrypt.compare(password, (existingAdmin as any).password);
    if (!passwordMatches) {
      (existingAdmin as any).password = password; // will be hashed by pre-save hook
      updated = true;
    }

    if (updated) {
      await existingAdmin.save();
      console.log(`Updated default admin account (${email}).`);
    } else {
      console.log('Default admin account already exists and is up-to-date.');
    }
    return;
  }

  // Create new admin account
  const admin = new User({ name, email, password, role: 'admin' });
  await admin.save();
  console.log('Created default admin account:', email);
};
