import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskIdSchema,
  projectIdSchema,
} from '../validators/taskValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/tasks/:id - Get task details
router.get('/:id', validate(taskIdSchema), taskController.getTaskById);

// PUT /api/tasks/:id - Update task
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);

// DELETE /api/tasks/:id - Soft delete task
router.delete('/:id', validate(taskIdSchema), taskController.deleteTask);

// PATCH /api/tasks/:id/status - Update task status
router.patch('/:id/status', validate(updateTaskStatusSchema), taskController.updateTaskStatus);

export default router;
