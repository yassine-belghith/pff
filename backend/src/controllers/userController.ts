import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../models/User';

// Extend the Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '1d' }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    const allowedRoles = ['user', 'worker', 'admin'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    // Generate JWT token
    const token = generateToken((user as any)._id.toString());

    // Return user data (excluding password)
    const userResponse = { ...user.toObject() };
    delete (userResponse as any).password;

    res.status(201).json({
      user: userResponse,
      token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken((user as any)._id.toString());

    // Return user data (excluding password)
    const userResponse = { ...user.toObject() };
    delete (userResponse as any).password;

    res.status(200).json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
