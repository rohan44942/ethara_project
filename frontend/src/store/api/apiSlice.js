import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Projects', 'Tasks', 'Members', 'Dashboard'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    updateCurrentUser: builder.mutation({
      query: (updateData) => ({
        url: '/auth/me',
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['Auth'],
    }),
    getUserSuggestions: builder.query({
      query: (search) => ({
        url: `/auth/users`,
        params: { search },
      }),
    }),

    // Projects endpoints
    getProjects: builder.query({
      query: () => '/projects',
      providesTags: ['Projects'],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Projects', id }],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Projects', id }, 'Projects'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),

    // Tasks endpoints
    getProjectTasks: builder.query({
      query: (projectId) => `/projects/${projectId}/tasks`,
      providesTags: (result, error, projectId) =>
        result?.data?.tasks
          ? [
              ...result.data.tasks.map((task) => ({ type: 'Tasks', id: task.id })),
              { type: 'Tasks', projectId },
            ]
          : [{ type: 'Tasks', projectId }],
    }),
    getTask: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tasks', id }],
    }),
    createTask: builder.mutation({
      query: ({ projectId, ...taskData }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Tasks', projectId }, 'Dashboard'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tasks', id }, 'Dashboard'],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tasks', id }, 'Dashboard'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks', 'Dashboard'],
    }),

    // Members endpoints
    getProjectMembers: builder.query({
      query: (projectId) => `/projects/${projectId}/members`,
      providesTags: (result, error, projectId) => [{ type: 'Members', projectId }],
    }),
    addMember: builder.mutation({
      query: ({ projectId, ...memberData }) => ({
        url: `/projects/${projectId}/members`,
        method: 'POST',
        body: memberData,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Members', projectId }],
    }),
    removeMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Members', projectId }],
    }),
    updateMemberRole: builder.mutation({
      query: ({ projectId, userId, role }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: 'Members', projectId }],
    }),

    // Dashboard endpoints
    getDashboard: builder.query({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
    getStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getOverdueTasks: builder.query({
      query: () => '/dashboard/overdue',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useGetUserSuggestionsQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetProjectMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useGetDashboardQuery,
  useGetStatsQuery,
  useGetOverdueTasksQuery,
} = apiSlice;
