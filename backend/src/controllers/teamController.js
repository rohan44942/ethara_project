import { asyncHandler } from '../utils/errorHandler.js';
import * as teamService from '../services/teamService.js';

export const getProjectMembers = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user.id;

  const members = await teamService.getProjectMembers(projectId, userId);

  res.status(200).json({
    success: true,
    data: {
      members,
      count: members.length,
    },
  });
});

export const addMember = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user.id;
  const { email, role } = req.body;

  const membership = await teamService.addMember(projectId, userId, email, role);

  res.status(201).json({
    success: true,
    message: 'Member added successfully',
    data: {
      membership,
    },
  });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { id: projectId, userId: targetUserId } = req.params;
  const requesterId = req.user.id;

  const membership = await teamService.removeMember(projectId, requesterId, targetUserId);

  res.status(200).json({
    success: true,
    message: 'Member removed successfully',
    data: {
      membership,
    },
  });
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { id: projectId, userId: targetUserId } = req.params;
  const requesterId = req.user.id;
  const { role } = req.body;

  const membership = await teamService.updateMemberRole(
    projectId,
    requesterId,
    targetUserId,
    role
  );

  res.status(200).json({
    success: true,
    message: 'Member role updated successfully',
    data: {
      membership,
    },
  });
});
