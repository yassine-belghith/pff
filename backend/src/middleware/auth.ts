import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Extend the Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here') as { userId: string };
    
    // Convert string ID to ObjectId
    req.userId = new Types.ObjectId(decoded.userId);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
