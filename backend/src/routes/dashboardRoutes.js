import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/dashboard - Get user dashboard with overview
router.get('/', dashboardController.getDashboard);

// GET /api/dashboard/stats - Get task statistics
router.get('/stats', dashboardController.getStats);

// GET /api/dashboard/overdue - Get overdue tasks
router.get('/overdue', dashboardController.getOverdueTasks);

// GET /api/dashboard/tasks?status=TODO - Get tasks by status
router.get('/tasks', dashboardController.getTasksByStatus);

export default router;
