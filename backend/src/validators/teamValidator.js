import { z } from 'zod';

export const addMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID format'),
  }),
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    role: z
      .enum(['ADMIN', 'MEMBER'], {
        errorMap: () => ({ message: 'Role must be ADMIN or MEMBER' }),
      })
      .default('MEMBER'),
  }),
});

export const updateMemberRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID format'),
    userId: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    role: z.enum(['ADMIN', 'MEMBER'], {
      errorMap: () => ({ message: 'Role must be ADMIN or MEMBER' }),
    }),
  }),
});

export const memberParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID format'),
    userId: z.string().uuid('Invalid user ID format'),
  }),
});

export const projectIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID format'),
  }),
});
