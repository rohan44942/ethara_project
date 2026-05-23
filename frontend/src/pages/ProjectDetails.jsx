import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ListTodo, Plus, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetProjectQuery,
  useGetProjectMembersQuery,
  useGetProjectTasksQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from '../store/api/apiSlice';
import { showToast } from '../store/slices/uiSlice';
import { Card, LoadingSpinner, Button, Badge } from '../components/common';
import { MemberCard, AddMemberModal } from '../components/projects';
import { TaskCard } from '../components/tasks';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const dispatch = useDispatch();
  const { data: projectData, isLoading: projectLoading } = useGetProjectQuery(id);
  const { data: membersData, isLoading: membersLoading } = useGetProjectMembersQuery(id);
  const { data: tasksData, isLoading: tasksLoading } = useGetProjectTasksQuery(id);
  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();

  if (projectLoading || membersLoading || tasksLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const project = projectData?.data?.project;
  const members = membersData?.data?.members || [];
  const tasks = tasksData?.data?.tasks || [];
  const currentMember = members.find((m) => m.userId === currentUser?.id);
  const isAdmin = currentMember?.role === 'ADMIN';

  const handleAddMember = async (formData) => {
    try {
      await addMember({ projectId: id, ...formData }).unwrap();
      dispatch(showToast({ message: 'Member added successfully!', type: 'success' }));
    } catch (error) {
      dispatch(showToast({
        message: error.data?.error || 'Unable to add member. Please try again.',
        type: 'error',
      }));
      throw error;
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember({ projectId: id, userId }).unwrap();
      dispatch(showToast({ message: 'Member removed successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({
        message: error.data?.error || 'Failed to remove member.',
        type: 'error',
      }));
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateMemberRole({ projectId: id, userId, role }).unwrap();
      dispatch(showToast({ message: 'Member role updated', type: 'success' }));
    } catch (error) {
      dispatch(showToast({
        message: error.data?.error || 'Unable to update member role.',
        type: 'error',
      }));
    }
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: ListTodo, color: 'text-blue-600' },
    { label: 'Team Members', value: members.length, icon: Users, color: 'text-green-600' },
    { label: 'Completed', value: tasks.filter((t) => t.status === 'DONE').length, icon: ListTodo, color: 'text-purple-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
          <p className="text-gray-600 mt-1">{project?.description}</p>
          <Badge className="mt-2">{project?.status}</Badge>
        </div>
        {isAdmin && (
          <Button variant="outline">
            <Settings size={18} className="mr-2" />
            Settings
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`${stat.color}`} size={40} />
            </div>
          </Card>
        ))}
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Team
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recent Tasks">
            {tasksLoading ? (
              <LoadingSpinner />
            ) : tasks?.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.status}</p>
                    </div>
                    <Badge className={task.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => navigate(`/projects/${id}/tasks`)}>
                  View All Tasks
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No tasks yet</p>
            )}
          </Card>

          <Card title="Team Members">
            {membersLoading ? (
              <LoadingSpinner />
            ) : members?.length > 0 ? (
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.user.name}</p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
                    </div>
                    <Badge>{member.role}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('team')}>
                  View All Members
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No members yet</p>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Tasks</h2>
            <Button onClick={() => navigate(`/projects/${id}/tasks`)}>
              <Plus size={18} className="mr-2" />
              Manage Tasks
            </Button>
          </div>
          {tasksLoading ? (
            <LoadingSpinner />
          ) : tasks?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  <div className="flex gap-2">
                    <Badge>{task.status}</Badge>
                    <Badge className={task.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-8">No tasks yet. Create your first task!</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            {isAdmin && (
              <Button onClick={() => setIsAddMemberOpen(true)}>
                <Plus size={18} className="mr-2" />
                Add Member
              </Button>
            )}
          </div>
          {membersLoading ? (
            <LoadingSpinner />
          ) : members?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <MemberCard
                  key={member.userId}
                  member={member}
                  currentUserId={currentUser?.id}
                  onRemove={handleRemoveMember}
                  onRoleChange={handleRoleChange}
                  canManage={isAdmin}
                />
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-8">No team members yet</p>
            </Card>
          )}
        </div>
      )}

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
};

export default ProjectDetails;
