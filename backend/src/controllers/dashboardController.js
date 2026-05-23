import { asyncHandler } from '../utils/errorHandler.js';
import * as dashboardService from '../services/dashboardService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const dashboard = await dashboardService.getDashboard(userId);

  res.status(200).json({
    success: true,
    data: dashboard,
  });
});

export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await dashboardService.getStats(userId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const getOverdueTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const overdueTasks = await dashboardService.getOverdueTasks(userId);

  res.status(200).json({
    success: true,
    data: {
      tasks: overdueTasks,
      count: overdueTasks.length,
    },
  });
});

export const getTasksByStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({
      success: false,
      error: 'Status query parameter is required',
    });
  }

  const tasks = await dashboardService.getTasksByStatus(userId, status);

  res.status(200).json({
    success: true,
    data: {
      tasks,
      count: tasks.length,
      status,
    },
  });
});
