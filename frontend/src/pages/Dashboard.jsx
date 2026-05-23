import { useGetDashboardQuery, useGetStatsQuery } from '../store/api/apiSlice';
import { Card, LoadingSpinner, Badge } from '../components/common';
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardQuery();
  const { data: statsData, isLoading: statsLoading } = useGetStatsQuery();

  if (dashboardLoading || statsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const stats = statsData?.data || {};
  const dashboard = dashboardData?.data || {};

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects || 0,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks || 0,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-green-100',
    },
    {
      title: 'My Tasks',
      value: stats.myTasks || 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks || 0,
      icon: AlertCircle,
      color: 'text-error',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Tasks */}
      <Card title="Recent Tasks">
        {dashboard.recentTasks && dashboard.recentTasks.length > 0 ? (
          <div className="space-y-3">
            {dashboard.recentTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.project?.name}</p>
                </div>
                <Badge variant={task.status === 'DONE' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'gray'}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent tasks</p>
        )}
      </Card>

      {/* Overdue Tasks */}
      {dashboard.overdueTasks && dashboard.overdueTasks.length > 0 && (
        <Card title="Overdue Tasks" className="border-error">
          <div className="space-y-3">
            {dashboard.overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.project?.name}</p>
                </div>
                <Badge variant="danger">
                  {task.daysOverdue} days overdue
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
