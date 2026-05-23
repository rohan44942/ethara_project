import express from 'express';
import * as teamController from '../controllers/teamController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  addMemberSchema,
  updateMemberRoleSchema,
  memberParamsSchema,
  projectIdParamsSchema,
} from '../validators/teamValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/projects/:id/members - Get project members
router.get('/:id/members', validate(projectIdParamsSchema), teamController.getProjectMembers);

// POST /api/projects/:id/members - Add member to project (Admin only)
router.post('/:id/members', validate(addMemberSchema), teamController.addMember);

// PATCH /api/projects/:id/members/:userId - Remove member (Admin only)
router.patch('/:id/members/:userId', validate(memberParamsSchema), teamController.removeMember);

// PUT /api/projects/:id/members/:userId - Update member role (Admin only)
router.put('/:id/members/:userId', validate(updateMemberRoleSchema), teamController.updateMemberRole);

export default router;
