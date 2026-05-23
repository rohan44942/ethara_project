import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProjectsQuery, useGetProjectMembersQuery, useAddMemberMutation, useRemoveMemberMutation, useUpdateMemberRoleMutation } from '../store/api/apiSlice';
import { selectCurrentUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { Card, Button, LoadingSpinner } from '../components/common';
import { AddMemberModal } from '../components/projects';
import { MemberCard } from '../components/projects';
import { Users, Briefcase, Search, Plus } from 'lucide-react';

export default function Team() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const projects = projectsData?.data?.projects || [];

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const { data: membersData, isLoading: membersLoading } = useGetProjectMembersQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const members = membersData?.data?.members || [];
  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();

  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const currentMembership = members.find((member) => member.userId === currentUser?.id);
  const isAdmin = currentMembership?.role === 'ADMIN';

  const filteredMembers = members.filter((member) => {
    const lower = searchTerm.toLowerCase();
    return (
      member.user.name.toLowerCase().includes(lower) ||
      member.user.email.toLowerCase().includes(lower) ||
      member.role.toLowerCase().includes(lower)
    );
  });

  const handleAddMember = async (formData) => {
    try {
      await addMember({ projectId: selectedProjectId, ...formData }).unwrap();
      dispatch(showToast({ message: 'Member added to project.', type: 'success' }));
    } catch (error) {
      dispatch(showToast({
        message: error.data?.error || 'Unable to add member.',
        type: 'error',
      }));
      throw error;
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember({ projectId: selectedProjectId, userId }).unwrap();
      dispatch(showToast({ message: 'Member removed from project.', type: 'success' }));
    } catch (error) {
      dispatch(showToast({
        message: error.data?.error || 'Unable to remove member.',
        type: 'error',
      }));
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateMemberRole({ projectId: selectedProjectId, userId, role }).unwrap();
      dispatch(showToast({ message: 'Member role updated.', type: 'success' }));
    } catch (error) {
      dispatch(showToast({
        message: error.data?.error || 'Unable to update role.',
        type: 'error',
      }));
    }
  };

  if (projectsLoading || (!selectedProjectId && projects.length > 0)) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">View and manage members across your projects.</p>
        </div>
        {isAdmin && selectedProject && (
          <Button onClick={() => setIsAddMemberOpen(true)} variant="primary" icon={<Plus size={18} />}>
            Add Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <div className="space-y-4">
          <Card title="Projects">
            <div className="space-y-3">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                      project.id === selectedProjectId
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-primary hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold truncate">{project.name}</p>
                        <p className="text-sm text-gray-500 mt-1 truncate">{project.description || 'No description'}</p>
                      </div>
                      <Users size={18} className="text-gray-400" />
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No projects available. Create a project first.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title={selectedProject ? `Team: ${selectedProject.name}` : 'Select a project'}>
            {selectedProject ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Briefcase size={18} />
                  <span>{selectedProject._count?.members ?? 0} members</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {membersLoading ? (
                  <LoadingSpinner />
                ) : filteredMembers.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredMembers.map((member) => (
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
                  <p className="text-gray-500 text-center py-10">No members found for this project.</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Select a project from the left panel to view team members.</p>
            )}
          </Card>
        </div>
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
}
