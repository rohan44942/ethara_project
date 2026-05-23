import { Mail, Shield, UserX } from 'lucide-react';
import { Badge } from '../common';
import { motion } from 'framer-motion';

export default function MemberCard({ member, currentUserId, onRemove, onRoleChange, canManage }) {
  const isCurrentUser = member.userId === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-lg">
            {member.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {member.user.name}
              {isCurrentUser && <span className="text-sm text-gray-500 ml-2">(You)</span>}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Mail size={14} />
              <span>{member.user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage && !isCurrentUser ? (
            <select
              value={member.role}
              onChange={(e) => onRoleChange(member.userId, e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          ) : (
            <Badge className={member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
              <Shield size={12} className="inline mr-1" />
              {member.role}
            </Badge>
          )}

          {canManage && !isCurrentUser && (
            <button
              onClick={() => onRemove(member.userId)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Remove member"
            >
              <UserX size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
