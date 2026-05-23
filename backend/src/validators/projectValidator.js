import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Project name is required',
      })
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters')
      .trim(),
    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .trim()
      .optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .trim()
      .optional(),
    status: z
      .enum(['ACTIVE', 'INACTIVE'], {
        errorMap: () => ({ message: 'Status must be ACTIVE or INACTIVE' }),
      })
      .optional(),
  }),
});

export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID format'),
  }),
});
