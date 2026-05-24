import { asyncHandler } from '../utils/errorHandler.js';
import * as authService from '../services/authService.js';

export const signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const { user, token } = await authService.signup(email, password, name);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  const updateData = req.body;
  const user = await authService.updateCurrentUser(req.user.id, updateData);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user,
    },
  });
});
