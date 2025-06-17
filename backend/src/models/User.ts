import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'worker' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User model (static methods)
interface IUserModel extends Model<IUser> {
  // Add any static methods here
}

const userSchema = new Schema<IUser, IUserModel>({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'worker', 'admin'],
    default: 'user',
    required: true
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      const transformed = { ...ret };
      delete transformed.password;
      delete transformed.__v;
      return transformed;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      const transformed = { ...ret };
      delete transformed.password;
      delete transformed.__v;
      return transformed;
    }
  }
});

// Create index on role for faster role-based queries
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);};

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
