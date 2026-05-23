import { asyncHandler } from '../utils/errorHandler.js';
import * as taskService from '../services/taskService.js';

export const createTask = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user.id;
  const taskData = req.body;

  const task = await taskService.createTask(projectId, userId, taskData);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task,
    },
  });
});

export const getProjectTasks = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const userId = req.user.id;

  const tasks = await taskService.getProjectTasks(projectId, userId);

  res.status(200).json({
    success: true,
    data: {
      tasks,
      count: tasks.length,
    },
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const userId = req.user.id;

  const task = await taskService.getTaskById(taskId, userId);

  res.status(200).json({
    success: true,
    data: {
      task,
    },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  const task = await taskService.updateTask(taskId, userId, updateData);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: {
      task,
    },
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const userId = req.user.id;

  const task = await taskService.deleteTask(taskId, userId);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {
      task,
    },
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const userId = req.user.id;
  const { status } = req.body;

  const task = await taskService.updateTaskStatus(taskId, userId, status);

  res.status(200).json({
    success: true,
    message: 'Task status updated successfully',
    data: {
      task,
    },
  });
});
