import { Calendar, User, Trash2, Edit } from 'lucide-react';
import { Badge } from '../common';
import { motion } from 'framer-motion';

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
};

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{task.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-800">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge>
        <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
        {isOverdue && <Badge className="bg-red-100 text-red-800">OVERDUE</Badge>}
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          {task.assignee && (
            <div className="flex items-center gap-1 min-w-0">
              <User size={14} />
              <span>{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1 min-w-0">
              <Calendar size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-xs border rounded px-2 py-1 min-w-[120px] w-full sm:w-auto"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Completed</option>
        </select>
      </div>
    </motion.div>
  );
}
