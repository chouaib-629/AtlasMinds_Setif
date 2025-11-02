'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Event } from '@/lib/api';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

export default function EventsPage() {
  const { isSuperAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ type?: string; attendance_type?: string }>({
    type: isSuperAdmin ? undefined : 'local',
    attendance_type: isSuperAdmin ? undefined : 'in-person',
  });
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'local' as Event['type'],
    attendance_type: 'in-person' as Event['attendance_type'],
    date: '',
    location: '',
    price: '',
    has_price: false,
  });

  useEffect(() => {
    loadEvents();
  }, [filter, isSuperAdmin]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents(filter);
      if (response.success && response.data) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData: any = {
        ...formData,
      };
      if (formData.has_price && formData.price) {
        submitData.price = parseFloat(formData.price);
      } else {
        submitData.price = null;
        submitData.has_price = false;
      }
      if (editingEvent) {
        await apiService.updateEvent(editingEvent.id, submitData);
      } else {
        await apiService.createEvent(submitData);
      }
      setShowModal(false);
      setEditingEvent(null);
        setFormData({
          title: '',
          description: '',
          type: 'local',
          attendance_type: 'in-person',
          date: '',
          location: '',
          price: '',
          has_price: false,
        });
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await apiService.deleteEvent(id);
        loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        type: event.type,
        attendance_type: event.attendance_type,
        date: event.date.split('T')[0],
        location: event.location || '',
        price: event.price?.toString() || '',
        has_price: event.has_price || false,
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
                Events & Activities
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isSuperAdmin
                  ? 'Manage national, online, and hybrid events'
                  : 'Manage local in-house events and activities'}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setFormData({
                  title: '',
                  description: '',
                  type: isSuperAdmin ? 'national' : 'local',
                  attendance_type: isSuperAdmin ? 'online' : 'in-person',
                  date: '',
                  location: '',
                  price: '',
                  has_price: false,
                });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Create Event
            </button>
          </div>

          {/* Filters */}
          {isSuperAdmin && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex gap-4">
                <select
                  value={filter.type || ''}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="national">National</option>
                  <option value="local">Local</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <select
                  value={filter.attendance_type || ''}
                  onChange={(e) => setFilter({ ...filter, attendance_type: e.target.value || undefined })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Attendance Types</option>
                  <option value="online">Online</option>
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          )}

          {/* Events List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="text-indigo-600 hover:text-indigo-700 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">Attendance:</span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                        {event.attendance_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Location:</span>
                        <span className="text-gray-900 dark:text-white">{event.location}</span>
                      </div>
                    )}
                    {event.has_price && event.price && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Price:</span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs font-semibold">
                          {event.price} DA
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/events/${event.id}/inscriptions`}
                    className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View Inscriptions →
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
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
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>
                  {isSuperAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="national">National</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="local">Local</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Attendance Type
                    </label>
                    <select
                      value={formData.attendance_type}
                      onChange={(e) => setFormData({ ...formData, attendance_type: e.target.value as Event['attendance_type'] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {isSuperAdmin && <option value="online">Online</option>}
                      {isSuperAdmin && <option value="hybrid">Hybrid</option>}
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="has_price"
                        checked={formData.has_price}
                        onChange={(e) =>
                          setFormData({ ...formData, has_price: e.target.checked, price: e.target.checked ? formData.price : '' })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="has_price" className="text-sm text-gray-700 dark:text-gray-300">
                        This event has a symbolic price
                      </label>
                    </div>
                    {formData.has_price && (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Enter price in DA"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      {editingEvent ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingEvent(null);
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
