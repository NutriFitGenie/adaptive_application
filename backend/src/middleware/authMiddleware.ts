import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env.config';

// Define a custom type for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: any; // You can replace `any` with a proper User type if needed
}

/**
 * Middleware to verify JWT token and protect routes
 */
export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Attach user data to request for use in other routes
    req.user = decoded;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};