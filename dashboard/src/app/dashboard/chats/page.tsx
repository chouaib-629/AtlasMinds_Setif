'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Chat, Event } from '@/lib/api';
import { Edit, Trash2 } from 'lucide-react';

export default function ChatsPage() {
  const { isSuperAdmin } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChat, setEditingChat] = useState<Chat | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_active: true,
    event_id: '',
  });

  useEffect(() => {
    loadChats();
    loadEvents();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getChats();
      if (response.success && response.data) {
        setChats(response.data.chats);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await apiService.getEvents(
        isSuperAdmin ? {} : { type: 'local', attendance_type: 'in-person' }
      );
      if (response.success && response.data) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        title: formData.title,
        description: formData.description,
        is_active: formData.is_active,
      };
      if (formData.event_id) {
        data.event_id = parseInt(formData.event_id);
      }

      if (editingChat) {
        await apiService.updateChat(editingChat.id, data);
      } else {
        await apiService.createChat(data);
      }
      setShowModal(false);
      setEditingChat(null);
      setFormData({ title: '', description: '', is_active: true, event_id: '' });
      loadChats();
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await apiService.deleteChat(id);
        loadChats();
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };

  const openEditModal = (chat: Chat) => {
    setEditingChat(chat);
    setFormData({
      title: chat.title,
      description: chat.description || '',
      is_active: chat.is_active,
      event_id: chat.event_id?.toString() || '',
    });
    setShowModal(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Chats Management
              </h2>
              <p className="text-gray-600 mt-1">
                Create and manage chat rooms for events and activities
              </p>
            </div>
            <button
              onClick={() => {
                setEditingChat(null);
                setFormData({ title: '', description: '', is_active: true, event_id: '' });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Create Chat
            </button>
          </div>

          {/* Chats List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block  rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No chats found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {chat.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            chat.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {chat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(chat)}
                        className="text-indigo-600 hover:text-indigo-700 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(chat.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {chat.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {chat.description}
                    </p>
                  )}
                  {chat.event_id && (
                    <p className="text-xs text-gray-500">
                      Event ID: {chat.event_id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingChat ? 'Edit Chat' : 'Create Chat'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event (Optional)
                    </label>
                    <select
                      value={formData.event_id}
                      onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    >
                      <option value="">No Event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      {editingChat ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingChat(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

