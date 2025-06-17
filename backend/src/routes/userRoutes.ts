import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { register, login, getCurrentUser } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = Router();

// Custom type for async request handlers
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Helper function to wrap async route handlers
const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

// Protected routes
router.get('/me', auth, asyncHandler(getCurrentUser));

export default router;
