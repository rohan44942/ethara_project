import { useNavigate } from 'react-router-dom';
import { useGetProjectsQuery } from '../store/api/apiSlice';
import { Card, LoadingSpinner, Button, Badge } from '../components/common';
import { Plus, Users, CheckSquare } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectsQuery();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const projects = data?.data?.projects || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your team projects</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />}>
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

                <div className="flex items-center gap-4 text-sm text-gray-500">
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
                  <Badge variant="primary">
                    {project.status}
                  </Badge>
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
            <Button variant="primary" icon={<Plus size={20} />}>
              Create Your First Project
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Projects;
