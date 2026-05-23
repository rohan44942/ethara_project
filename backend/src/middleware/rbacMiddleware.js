import { AppError } from '../utils/errorHandler.js';
import prisma from '../config/database.js';

export const checkProjectAccess = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const userId = req.user.id;

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

    // Attach membership to request
    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkProjectAdmin = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const userId = req.user.id;

    // Check if user is an admin of the project
    const membership = await prisma.teamMembership.findFirst({
      where: {
        projectId,
        userId,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      throw new AppError('Access denied. Admin privileges required', 403);
    }

    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkTaskAccess = async (req, res, next) => {
  try {
    const { id: taskId } = req.params;
    const userId = req.user.id;

    // Get task with project info
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: {
              where: {
                userId,
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (task.project.members.length === 0) {
      throw new AppError('Access denied. You are not a member of this project', 403);
    }

    req.task = task;
    req.membership = task.project.members[0];
    next();
  } catch (error) {
    next(error);
  }
};
