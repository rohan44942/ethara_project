import prisma from '../config/database.js';
import { AppError } from '../utils/errorHandler.js';

export const createTask = async (projectId, userId, taskData) => {
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

  // Check if project is active
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.status !== 'ACTIVE') {
    throw new AppError('Project not found or inactive', 404);
  }

  // If assignedTo is provided, verify they are a member
  if (taskData.assignedTo) {
    const assigneeMembership = await prisma.teamMembership.findFirst({
      where: {
        projectId,
        userId: taskData.assignedTo,
        status: 'ACTIVE',
      },
    });

    if (!assigneeMembership) {
      throw new AppError('Assigned user is not a member of this project', 400);
    }
  }

  // Create task
  const task = await prisma.task.create({
    data: {
      projectId,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || null,
      priority: taskData.priority || 'MEDIUM',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      assignedTo: taskData.assignedTo || null,
      createdBy: userId,
      status: 'TODO',
      isDeleted: false,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return task;
};

export const getProjectTasks = async (projectId, userId) => {
  // Check if user is a member
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

  // Get all non-deleted tasks
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      isDeleted: false,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' },
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
  });

  return tasks;
};

export const getTaskById = async (taskId, userId) => {
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
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      deleter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Check if user is a member
  if (task.project.members.length === 0) {
    throw new AppError('Access denied. You are not a member of this project', 403);
  }

  if (task.isDeleted) {
    throw new AppError('Task has been deleted', 404);
  }

  return task;
};

export const updateTask = async (taskId, userId, updateData) => {
  // Get task with membership info
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

  if (task.isDeleted) {
    throw new AppError('Cannot update deleted task', 400);
  }

  // Check if user is a member
  if (task.project.members.length === 0) {
    throw new AppError('Access denied. You are not a member of this project', 403);
  }

  // If assignedTo is being updated, verify new assignee is a member
  if (updateData.assignedTo !== undefined && updateData.assignedTo !== null && updateData.assignedTo !== '') {
    const assigneeMembership = await prisma.teamMembership.findFirst({
      where: {
        projectId: task.projectId,
        userId: updateData.assignedTo,
        status: 'ACTIVE',
      },
    });

    if (!assigneeMembership) {
      throw new AppError('Assigned user is not a member of this project', 400);
    }
  }

  // Update task
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(updateData.title && { title: updateData.title.trim() }),
      ...(updateData.description !== undefined && { 
        description: updateData.description?.trim() || null 
      }),
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.priority && { priority: updateData.priority }),
      ...(updateData.dueDate !== undefined && { 
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null 
      }),
      ...(updateData.assignedTo !== undefined && { 
        assignedTo: updateData.assignedTo || null 
      }),
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedTask;
};

export const deleteTask = async (taskId, userId) => {
  // Get task with membership info
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

  if (task.isDeleted) {
    throw new AppError('Task is already deleted', 400);
  }

  // Check if user is a member
  if (task.project.members.length === 0) {
    throw new AppError('Access denied. You are not a member of this project', 403);
  }

  const userMembership = task.project.members[0];

  // Only admin or task creator can delete
  if (userMembership.role !== 'ADMIN' && task.createdBy !== userId) {
    throw new AppError('Access denied. Only admins or task creator can delete tasks', 403);
  }

  // Soft delete - set isDeleted flag and record who deleted it
  const deletedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      deleter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return deletedTask;
};

export const updateTaskStatus = async (taskId, userId, newStatus) => {
  // Get task with membership info
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

  if (task.isDeleted) {
    throw new AppError('Cannot update deleted task', 400);
  }

  // Check if user is a member
  if (task.project.members.length === 0) {
    throw new AppError('Access denied. You are not a member of this project', 403);
  }

  // Update status
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: newStatus,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedTask;
};
