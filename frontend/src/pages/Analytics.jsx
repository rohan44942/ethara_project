import { useGetStatsQuery, useGetOverdueTasksQuery } from '../store/api/apiSlice';
import { Card, LoadingSpinner, Badge } from '../components/common';
import { BarChart3, CheckCircle2, Folder, Clock, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const { data: statsData, isLoading: statsLoading } = useGetStatsQuery();
  const { data: overdueData, isLoading: overdueLoading } = useGetOverdueTasksQuery();

  if (statsLoading || overdueLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const stats = statsData?.data || {};
  const overdueTasks = overdueData?.data?.tasks || [];

  const statCards = [
    {
      title: 'Projects',
      value: stats.totalProjects || 0,
      icon: Folder,
      color: 'text-primary',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Assigned Tasks',
      value: stats.myTasks || 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Completed',
      value: stats.tasksByStatus?.done || 0,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks || 0,
      icon: AlertTriangle,
      color: 'text-error',
      bgColor: 'bg-red-100',
    },
  ];

  const completionRate =
    stats.completionRate >= 0 && stats.completionRate <= 1
      ? Math.round(stats.completionRate * 100)
      : Math.round(stats.completionRate ?? 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track progress and discover the tasks that need attention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="p-0">
            <div className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className={card.color} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Completion Trend">
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Task completion rate</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{completionRate}%</p>
              </div>
              <Badge className="bg-green-100 text-green-800">{stats.tasksByStatus?.DONE ?? 0} done</Badge>
            </div>
            <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900">To Do</p>
                <p>{stats.tasksByStatus?.todo ?? 0}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">In Progress</p>
                <p>{stats.tasksByStatus?.inProgress ?? 0}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Completed</p>
                <p>{stats.tasksByStatus?.done ?? 0}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Overdue Tasks">
          {overdueTasks.length ? (
            <div className="space-y-3">
              {overdueTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.project?.name || 'Project'}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">{task.daysOverdue ?? 'Late'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No overdue tasks right now.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
