import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, User as UserIcon, Calendar } from 'lucide-react';
import { useGetStatsQuery } from '../store/api/apiSlice';
import { Card, Button, Input, LoadingSpinner } from '../components/common';
import { selectCurrentUser, updateUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const { data: statsData, isLoading: statsLoading } = useGetStatsQuery();

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData));
    dispatch(showToast({
      message: 'Profile saved locally. Backend update is not configured yet.',
      type: 'info',
    }));
    setIsEditing(false);
  };

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-primary text-white rounded-full flex items-center justify-center text-5xl font-bold mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2" title="Personal Information">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={<UserIcon size={20} />}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail size={20} />}
                required
              />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900 mt-1">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 mt-1">{user?.status}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </Card>
      </div>

      <Card title="Account Statistics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{statsData?.data?.stats?.totalProjects ?? 0}</p>
            <p className="text-gray-600 mt-1">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success">{statsData?.data?.stats?.tasksByStatus?.done ?? 0}</p>
            <p className="text-gray-600 mt-1">Tasks Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary">{statsData?.data?.stats?.myTasks ?? 0}</p>
            <p className="text-gray-600 mt-1">Assigned Tasks</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
