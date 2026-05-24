import { useEffect, useState } from 'react';
import { Modal, Input, Button } from '../common';
import { useGetUserSuggestionsQuery } from '../../store/api/apiSlice';

export default function AddMemberModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'MEMBER',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const value = formData.email.trim();
    if (value.length >= 2) {
      const timeout = setTimeout(() => setSearchTerm(value), 300);
      return () => clearTimeout(timeout);
    }
    setSearchTerm('');
  }, [formData.email]);

  const { data: suggestionData, isFetching: suggestionsLoading } = useGetUserSuggestionsQuery(searchTerm, {
    skip: !searchTerm,
  });
  const suggestions = suggestionData?.data?.users || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await onAdd(formData);
      setFormData({ email: '', role: 'MEMBER' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add member');
    }
  };

  const handleSuggestionClick = (email) => {
    setFormData((prev) => ({ ...prev, email }));
    setSearchTerm('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="member@example.com"
            required
          />

          {searchTerm && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-sm z-10 max-h-56 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((user) => (
                  <button
                    type="button"
                    key={user.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(user.email);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">{suggestionsLoading ? 'Searching...' : 'No matching emails found.'}</div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Admins can manage team members and project settings
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Member</Button>
        </div>
      </form>
    </Modal>
  );
}
