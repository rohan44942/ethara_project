import { z } from 'zod';

export const createTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID format'),
  }),
  body: z.object({
    title: z
      .string({
        required_error: 'Task title is required',
      })
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters')
      .trim(),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .trim()
      .optional(),
    priority: z
      .enum(['LOW', 'MEDIUM', 'HIGH'], {
        errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
      })
      .default('MEDIUM'),
    dueDate: z
      .string()
      .datetime('Invalid date format')
      .optional()
      .or(z.literal('')),
    assignedTo: z
      .string()
      .uuid('Invalid user ID format')
      .optional()
      .or(z.literal('')),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
  body: z.object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .trim()
      .optional(),
    status: z
      .enum(['TODO', 'IN_PROGRESS', 'DONE'], {
        errorMap: () => ({ message: 'Status must be TODO, IN_PROGRESS, or DONE' }),
      })
      .optional(),
    priority: z
      .enum(['LOW', 'MEDIUM', 'HIGH'], {
        errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
      })
      .optional(),
    dueDate: z
      .string()
      .datetime('Invalid date format')
      .optional()
      .or(z.literal(''))
      .or(z.null()),
    assignedTo: z
      .string()
      .uuid('Invalid user ID format')
      .optional()
      .or(z.literal(''))
      .or(z.null()),
  }),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
  body: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
      errorMap: () => ({ message: 'Status must be TODO, IN_PROGRESS, or DONE' }),
    }),
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID format'),
  }),
});

export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID format'),
  }),
});
