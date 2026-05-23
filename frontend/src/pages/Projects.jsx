import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProjectsQuery, useCreateProjectMutation } from '../store/api/apiSlice';
import { Card, LoadingSpinner, Button, Badge, Modal, Input } from '../components/common';
import { Plus, Users, CheckSquare } from 'lucide-react';
import { showToast } from '../store/slices/uiSlice';

const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  const projects = data?.data?.projects || [];

  const validate = () => {
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      validationErrors.name = 'Project name must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      validationErrors.description = 'Description must be 500 characters or less';
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createProject({ name: formData.name.trim(), description: formData.description.trim() }).unwrap();
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      setErrors({});
      dispatch(showToast({ message: 'Project created successfully!', type: 'success' }));
    } catch (error) {
      dispatch(showToast({
        message: error.data?.error || 'Unable to create project. Please try again.',
        type: 'error',
      }));
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your team projects</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={() => setIsModalOpen(true)}
        >
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              hover
              onClick={() => navigate(`/projects/${project.id}`)}
              className="cursor-pointer"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{project.description || 'No description'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{project._count?.members || 0} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckSquare size={16} />
                    <span>{project._count?.tasks || 0} tasks</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <Badge variant="primary">{project.status}</Badge>
                  <span className="text-xs text-gray-500">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects yet</p>
            <Button variant="primary" icon={<Plus size={20} />} onClick={() => setIsModalOpen(true)}>
              Create Your First Project
            </Button>
          </div>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter a project name"
            error={errors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Optional project description"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? 'border-error' : 'border-gray-300'}`}
            />
            {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
