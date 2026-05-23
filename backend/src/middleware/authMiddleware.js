import { verifyToken } from '../utils/jwtUtils.js';
import { AppError } from '../utils/errorHandler.js';
import prisma from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('User account is inactive', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
