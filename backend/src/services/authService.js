import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwtUtils.js';
import { AppError } from '../utils/errorHandler.js';

const SALT_ROUNDS = 10;

export const signup = async (email, password, name) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: name.trim(),
      status: 'ACTIVE',
    },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      createdAt: true,
    },
  });

  // Generate JWT token
  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
};

export const login = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (user.status !== 'ACTIVE') {
    throw new AppError('Account is inactive. Please contact support', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken({ userId: user.id, email: user.email });

  // Return user without password
  const { passwordHash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
