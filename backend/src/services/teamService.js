import prisma from '../config/database.js';
import { AppError } from '../utils/errorHandler.js';

export const getProjectMembers = async (projectId, userId) => {
  // Check if user is a member of the project
  const membership = await prisma.teamMembership.findFirst({
    where: {
      projectId,
      userId,
      status: 'ACTIVE',
    },
  });

  if (!membership) {
    throw new AppError('Access denied. You are not a member of this project', 403);
  }

  // Get all active members
  const members = await prisma.teamMembership.findMany({
    where: {
      projectId,
      status: 'ACTIVE',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      },
    },
    orderBy: {
      joinedAt: 'asc',
    },
  });

  return members;
};

export const addMember = async (projectId, requesterId, email, role) => {
  // Check if requester is admin
  const requesterMembership = await prisma.teamMembership.findFirst({
    where: {
      projectId,
      userId: requesterId,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  if (!requesterMembership) {
    throw new AppError('Access denied. Admin privileges required', 403);
  }

  // Check if project exists and is active
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.status !== 'ACTIVE') {
    throw new AppError('Cannot add members to inactive project', 400);
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AppError('User with this email not found', 404);
  }

  if (user.status !== 'ACTIVE') {
    throw new AppError('Cannot add inactive user to project', 400);
  }

  // Check if user is already a member
  const existingMembership = await prisma.teamMembership.findFirst({
    where: {
      projectId,
      userId: user.id,
    },
  });

  if (existingMembership) {
    if (existingMembership.status === 'ACTIVE') {
      throw new AppError('User is already a member of this project', 400);
    }
    
    // Reactivate if previously removed
    const reactivatedMembership = await prisma.teamMembership.update({
      where: { id: existingMembership.id },
      data: {
        status: 'ACTIVE',
        role: role || 'MEMBER',
        removedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return reactivatedMembership;
  }

  // Add new member
  const membership = await prisma.teamMembership.create({
    data: {
      projectId,
      userId: user.id,
      role: role || 'MEMBER',
      status: 'ACTIVE',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return membership;
};

export const removeMember = async (projectId, requesterId, targetUserId) => {
  // Check if requester is admin
  const requesterMembership = await prisma.teamMembership.findFirst({
    where: {
      projectId,
      userId: requesterId,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  if (!requesterMembership) {
    throw new AppError('Access denied. Admin privileges required', 403);
  }

  // Cannot remove yourself if you're the only admin
  if (requesterId === targetUserId) {
    const adminCount = await prisma.teamMembership.count({
      where: {
        projectId,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    if (adminCount === 1) {
      throw new AppError('Cannot remove yourself. You are the only admin', 400);
    }
  }

  // Find target membership
  const targetMembership = await prisma.teamMembership.findFirst({
    where: {
      projectId,
      userId: targetUserId,
      status: 'ACTIVE',
    },
  });

  if (!targetMembership) {
    throw new AppError('User is not an active member of this project', 404);
  }

  // Soft delete - set status to INACTIVE
  const updatedMembership = await prisma.teamMembership.update({
    where: { id: targetMembership.id },
    data: {
      status: 'INACTIVE',
      removedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedMembership;
};

export const updateMemberRole = async (projectId, requesterId, targetUserId, newRole) => {
  // Check if requester is admin
  const requesterMembership = await prisma.teamMembership.findFirst({
    where: {
      projectId,
      userId: requesterId,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  if (!requesterMembership) {
    throw new AppError('Access denied. Admin privileges required', 403);
  }

  // Cannot change your own role if you're the only admin
  if (requesterId === targetUserId && newRole === 'MEMBER') {
    const adminCount = await prisma.teamMembership.count({
      where: {
        projectId,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    if (adminCount === 1) {
      throw new AppError('Cannot demote yourself. You are the only admin', 400);
    }
  }

  // Find target membership
  const targetMembership = await prisma.teamMembership.findFirst({
    where: {
      projectId,
      userId: targetUserId,
      status: 'ACTIVE',
    },
  });

  if (!targetMembership) {
    throw new AppError('User is not an active member of this project', 404);
  }

  // Update role
  const updatedMembership = await prisma.teamMembership.update({
    where: { id: targetMembership.id },
    data: {
      role: newRole,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedMembership;
};
