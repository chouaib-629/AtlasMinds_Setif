'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Livestream, Event } from '@/lib/api';
import { Edit, Trash2, Radio } from 'lucide-react';

export default function LivestreamsPage() {
  const { isSuperAdmin } = useAuth();
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLivestream, setEditingLivestream] = useState<Livestream | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stream_url: '',
    is_live: false,
    event_id: '',
  });

  useEffect(() => {
    loadLivestreams();
    loadEvents();
  }, []);

  const loadLivestreams = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLivestreams();
      if (response.success && response.data) {
        setLivestreams(response.data.livestreams);
      }
    } catch (error) {
      console.error('Error loading livestreams:', error);
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
        stream_url: formData.stream_url,
        is_live: formData.is_live,
      };
      if (formData.event_id) {
        data.event_id = parseInt(formData.event_id);
      }

      if (editingLivestream) {
        await apiService.updateLivestream(editingLivestream.id, data);
      } else {
        await apiService.createLivestream(data);
      }
      setShowModal(false);
      setEditingLivestream(null);
      setFormData({
        title: '',
        description: '',
        stream_url: '',
        is_live: false,
        event_id: '',
      });
      loadLivestreams();
    } catch (error) {
      console.error('Error saving livestream:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this livestream?')) {
      try {
        await apiService.deleteLivestream(id);
        loadLivestreams();
      } catch (error) {
        console.error('Error deleting livestream:', error);
      }
    }
  };

  const openEditModal = (livestream: Livestream) => {
    setEditingLivestream(livestream);
    setFormData({
      title: livestream.title,
      description: livestream.description || '',
      stream_url: livestream.stream_url,
      is_live: livestream.is_live,
      event_id: livestream.event_id?.toString() || '',
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
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Livestreams Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create and manage livestreams for events and activities
              </p>
            </div>
            <button
              onClick={() => {
                setEditingLivestream(null);
                setFormData({
                  title: '',
                  description: '',
                  stream_url: '',
                  is_live: false,
                  event_id: '',
                });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Create Livestream
            </button>
          </div>

          {/* Livestreams List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : livestreams.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No livestreams found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {livestreams.map((livestream) => (
                <div
                  key={livestream.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {livestream.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            livestream.is_live
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 animate-pulse'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {livestream.is_live && <Radio className="h-3 w-3 fill-current" />}
                          {livestream.is_live ? 'LIVE' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(livestream)}
                        className="text-indigo-600 hover:text-indigo-700 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(livestream.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {livestream.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {livestream.description}
                    </p>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">URL:</span>
                      <a
                        href={livestream.stream_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                      >
                        {livestream.stream_url}
                      </a>
                    </div>
                    {livestream.event_id && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Event ID: {livestream.event_id}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {editingLivestream ? 'Edit Livestream' : 'Create Livestream'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stream URL
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.stream_url}
                      onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event (Optional)
                    </label>
                    <select
                      value={formData.event_id}
                      onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      id="is_live"
                      checked={formData.is_live}
                      onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="is_live" className="text-sm text-gray-700 dark:text-gray-300">
                      Currently Live
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      {editingLivestream ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingLivestream(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
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

