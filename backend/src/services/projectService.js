import prisma from '../config/database.js';
import { AppError } from '../utils/errorHandler.js';

export const createProject = async (userId, name, description) => {
  // Create project
  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      createdBy: userId,
      status: 'ACTIVE',
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Automatically add creator as ADMIN member
  await prisma.teamMembership.create({
    data: {
      projectId: project.id,
      userId: userId,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  return project;
};

export const getAllProjects = async (userId) => {
  // Get all projects where user is an active member
  const projects = await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
      members: {
        some: {
          userId: userId,
          status: 'ACTIVE',
        },
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          tasks: {
            where: {
              isDeleted: false,
            },
          },
          members: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return projects;
};

export const getProjectById = async (projectId, userId) => {
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

  // Get project details
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        where: {
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
        orderBy: {
          joinedAt: 'asc',
        },
      },
      tasks: {
        where: {
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
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (project.status !== 'ACTIVE') {
    throw new AppError('Project is inactive', 403);
  }

  return { project, userRole: membership.role };
};

export const updateProject = async (projectId, userId, updateData) => {
  // Check if user is admin
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

  // Check if project exists
  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    throw new AppError('Project not found', 404);
  }

  // Update project
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(updateData.name && { name: updateData.name.trim() }),
      ...(updateData.description !== undefined && { 
        description: updateData.description?.trim() || null 
      }),
      ...(updateData.status && { status: updateData.status }),
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          tasks: {
            where: {
              isDeleted: false,
            },
          },
          members: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  });

  return project;
};

export const deleteProject = async (projectId, userId) => {
  // Check if user is admin
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

  // Check if project exists
  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    throw new AppError('Project not found', 404);
  }

  // Soft delete - set status to INACTIVE
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: 'INACTIVE',
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return project;
};
