import prisma from '../config/database.js';

export const getDashboard = async (userId) => {
  // Get all projects where user is an active member
  const projects = await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
      members: {
        some: {
          userId,
          status: 'ACTIVE',
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const projectIds = projects.map((p) => p.id);

  // Get all tasks from user's projects
  const allTasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      isDeleted: false,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
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
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get tasks assigned to user
  const myTasks = allTasks.filter((task) => task.assignedTo === userId);

  // Get tasks created by user
  const createdByMe = allTasks.filter((task) => task.createdBy === userId);

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    totalTasks: allTasks.length,
    myTasks: myTasks.length,
    createdByMe: createdByMe.length,
    tasksByStatus: {
      todo: allTasks.filter((t) => t.status === 'TODO').length,
      inProgress: allTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      done: allTasks.filter((t) => t.status === 'DONE').length,
    },
    tasksByPriority: {
      low: allTasks.filter((t) => t.priority === 'LOW').length,
      medium: allTasks.filter((t) => t.priority === 'MEDIUM').length,
      high: allTasks.filter((t) => t.priority === 'HIGH').length,
    },
    myTasksByStatus: {
      todo: myTasks.filter((t) => t.status === 'TODO').length,
      inProgress: myTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      done: myTasks.filter((t) => t.status === 'DONE').length,
    },
  };

  // Get overdue tasks
  const now = new Date();
  const overdueTasks = allTasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < now &&
      task.status !== 'DONE'
  );

  // Get upcoming tasks (due in next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const upcomingTasks = allTasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) >= now &&
      new Date(task.dueDate) <= sevenDaysFromNow &&
      task.status !== 'DONE'
  );

  return {
    stats,
    recentTasks: allTasks.slice(0, 10), // Last 10 tasks
    myTasks: myTasks.slice(0, 10), // My last 10 tasks
    overdueTasks: overdueTasks.slice(0, 10),
    upcomingTasks: upcomingTasks.slice(0, 10),
    projects,
  };
};

export const getStats = async (userId) => {
  // Get all projects where user is an active member
  const projects = await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
      members: {
        some: {
          userId,
          status: 'ACTIVE',
        },
      },
    },
    select: {
      id: true,
    },
  });

  const projectIds = projects.map((p) => p.id);

  // Get task counts
  const totalTasks = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      isDeleted: false,
    },
  });

  const myTasks = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      assignedTo: userId,
      isDeleted: false,
    },
  });

  const todoTasks = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      status: 'TODO',
      isDeleted: false,
    },
  });

  const inProgressTasks = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      status: 'IN_PROGRESS',
      isDeleted: false,
    },
  });

  const doneTasks = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      status: 'DONE',
      isDeleted: false,
    },
  });

  const highPriorityTasks = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      priority: 'HIGH',
      isDeleted: false,
      status: { not: 'DONE' },
    },
  });

  // Get overdue count
  const now = new Date();
  const overdueTasks = await prisma.task.count({
    where: {
      projectId: { in: projectIds },
      dueDate: { lt: now },
      status: { not: 'DONE' },
      isDeleted: false,
    },
  });

  // Calculate completion rate
  const completionRate = totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(1) : 0;

  return {
    totalProjects: projects.length,
    totalTasks,
    myTasks,
    tasksByStatus: {
      todo: todoTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
    },
    highPriorityTasks,
    overdueTasks,
    completionRate: parseFloat(completionRate),
  };
};

export const getOverdueTasks = async (userId) => {
  // Get all projects where user is an active member
  const projects = await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
      members: {
        some: {
          userId,
          status: 'ACTIVE',
        },
      },
    },
    select: {
      id: true,
    },
  });

  const projectIds = projects.map((p) => p.id);

  // Get overdue tasks
  const now = new Date();
  const overdueTasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      dueDate: { lt: now },
      status: { not: 'DONE' },
      isDeleted: false,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
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
        },
      },
    },
    orderBy: {
      dueDate: 'asc', // Most overdue first
    },
  });

  // Calculate days overdue for each task
  const tasksWithOverdueDays = overdueTasks.map((task) => {
    const daysOverdue = Math.floor(
      (now.getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      ...task,
      daysOverdue,
    };
  });

  return tasksWithOverdueDays;
};

export const getTasksByStatus = async (userId, status) => {
  // Validate status
  const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  // Get all projects where user is an active member
  const projects = await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
      members: {
        some: {
          userId,
          status: 'ACTIVE',
        },
      },
    },
    select: {
      id: true,
    },
  });

  const projectIds = projects.map((p) => p.id);

  // Get tasks by status
  const tasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
      status,
      isDeleted: false,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
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
        },
      },
    },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' },
    ],
  });

  return tasks;
};
