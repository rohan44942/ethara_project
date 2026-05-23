import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import { useGetProjectTasksQuery, useGetProjectMembersQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, useUpdateTaskStatusMutation } from '../store/api/apiSlice';
import { TaskCard, TaskForm, TaskFilters } from '../components/tasks';
import { Button, Modal, LoadingSpinner } from '../components/common';
import { showConfirmDialog, showToast } from '../store/slices/uiSlice';

export default function Tasks() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
  });

  const { data: tasksData, isLoading: tasksLoading } = useGetProjectTasksQuery(projectId);
  const { data: membersData } = useGetProjectMembersQuery(projectId);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleCreateTask = async (formData) => {
    try {
      await createTask({ projectId, ...formData }).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      await updateTask({ id: editingTask.id, ...formData }).unwrap();
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
      dispatch(showToast({ message: 'Task deleted successfully.', type: 'success' }));
    } catch (error) {
      console.error('Failed to delete task:', error);
      dispatch(showToast({ message: 'Failed to delete task. Please try again.', type: 'error' }));
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus({ id: taskId, status }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (taskId) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task? This action cannot be undone.',
        onConfirm: () => handleDeleteTask(taskId),
        showDontAskAgain: false,
      })
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const tasks = tasksData?.data?.tasks || [];
  const members = membersData?.data?.members || [];

  const filteredTasks = tasks.filter((task) => {
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assignedTo && String(task.assignedTo) !== String(filters.assignedTo)) return false;
    return true;
  });

  const groupedTasks = {
    TODO: filteredTasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: filteredTasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: filteredTasks.filter((t) => t.status === 'DONE'),
  };

  if (tasksLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Task
        </Button>
      </div>

      <TaskFilters filters={filters} onFilterChange={setFilters} members={members} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
              <span>{status.replace('_', ' ')}</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {tasks.length === 0 && (
                <p className="text-gray-400 text-center py-8">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          members={members}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
