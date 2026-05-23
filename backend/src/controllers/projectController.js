import { asyncHandler } from '../utils/errorHandler.js';
import * as projectService from '../services/projectService.js';

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  const project = await projectService.createProject(userId, name, description);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: {
      project,
    },
  });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const projects = await projectService.getAllProjects(userId);

  res.status(200).json({
    success: true,
    data: {
      projects,
      count: projects.length,
    },
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { project, userRole } = await projectService.getProjectById(id, userId);

  res.status(200).json({
    success: true,
    data: {
      project,
      userRole,
    },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  const project = await projectService.updateProject(id, userId, updateData);

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: {
      project,
    },
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const project = await projectService.deleteProject(id, userId);

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: {
      project,
    },
  });
});
