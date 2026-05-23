import express from 'express';
import * as projectController from '../controllers/projectController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
} from '../validators/projectValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/projects - Get all user's projects
router.get('/', projectController.getAllProjects);

// POST /api/projects - Create new project
router.post('/', validate(createProjectSchema), projectController.createProject);

// GET /api/projects/:id - Get project details
router.get('/:id', validate(projectIdSchema), projectController.getProjectById);

// PUT /api/projects/:id - Update project (Admin only)
router.put(
  '/:id',
  validate(projectIdSchema),
  validate(updateProjectSchema),
  projectController.updateProject
);

// DELETE /api/projects/:id - Soft delete project (Admin only)
router.delete('/:id', validate(projectIdSchema), projectController.deleteProject);

export default router;
