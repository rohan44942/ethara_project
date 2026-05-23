import { useParams } from 'react-router-dom';
import { useGetProjectQuery } from '../store/api/apiSlice';
import { Card, LoadingSpinner } from '../components/common';

const ProjectDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetProjectQuery(id);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const project = data?.data?.project;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
        <p className="text-gray-600 mt-1">{project?.description}</p>
      </div>

      <Card title="Project Details">
        <p className="text-gray-600">Project details and tasks will be displayed here.</p>
      </Card>
    </div>
  );
};

export default ProjectDetails;
