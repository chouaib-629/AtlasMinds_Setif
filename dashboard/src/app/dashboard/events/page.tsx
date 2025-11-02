'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Event } from '@/lib/api';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { analyzeEventWithGemini } from '@/lib/gemini';
import EventSuggestionsModal from '@/components/Events/EventSuggestionsModal';

export default function EventsPage() {
  const { isSuperAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ type?: string; attendance_type?: string }>({
    type: isSuperAdmin ? undefined : 'local',
    attendance_type: isSuperAdmin ? undefined : 'in-person',
  });
  const [showModal, setShowModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
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
    
    // If editing, proceed directly without AI analysis
    if (editingEvent) {
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
        await apiService.updateEvent(editingEvent.id, submitData);
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
      return;
    }

    // For new events, show AI suggestions first
    try {
      setLoadingSuggestions(true);
      setPendingFormData({ ...formData });
      setShowModal(false);
      setShowSuggestionsModal(true);

      // Call Gemini API for analysis
      const eventAnalysis = await analyzeEventWithGemini({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        attendance_type: formData.attendance_type,
        date: formData.date,
        location: formData.location,
        price: formData.price,
        has_price: formData.has_price,
      });

      setSuggestions(eventAnalysis);
    } catch (error: any) {
      console.error('Error analyzing event:', error);
      // Show error message to user
      const errorMessage = error?.message || 'Failed to get AI suggestions. You can still proceed without them.';
      alert(errorMessage);
      // If Gemini fails, proceed with original submission
      proceedWithEventCreation(formData);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const proceedWithEventCreation = async (dataToUse: typeof formData) => {
    try {
      const submitData: any = {
        ...dataToUse,
      };
      if (dataToUse.has_price && dataToUse.price) {
        submitData.price = parseFloat(dataToUse.price);
      } else {
        submitData.price = null;
        submitData.has_price = false;
      }
      await apiService.createEvent(submitData);
      setShowSuggestionsModal(false);
      setSuggestions(null);
      setPendingFormData(null);
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
      alert('Failed to create event. Please try again.');
    }
  };

  const handleAcceptSuggestions = () => {
    if (pendingFormData && suggestions) {
      proceedWithEventCreation({
        ...pendingFormData,
        title: suggestions.title,
        description: suggestions.description,
      });
    }
  };

  const handleProceedWithout = () => {
    if (pendingFormData) {
      proceedWithEventCreation(pendingFormData);
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
              <h2 className="text-2xl font-semibold text-gray-900">
                Events & Activities
              </h2>
              <p className="text-gray-600 mt-1">
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
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-4">
                <select
                  value={filter.type || ''}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
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
              <div className="inline-block  rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
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
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Type:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Attendance:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {event.attendance_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-900">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Location:</span>
                        <span className="text-gray-900">{event.location}</span>
                      </div>
                    )}
                    {event.has_price && event.price && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Price:</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
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

          {/* Event Form Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
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
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      rows={3}
                    />
                  </div>
                  {isSuperAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      >
                        <option value="national">National</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="local">Local</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendance Type
                    </label>
                    <select
                      value={formData.attendance_type}
                      onChange={(e) => setFormData({ ...formData, attendance_type: e.target.value as Event['attendance_type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    >
                      {isSuperAdmin && <option value="online">Online</option>}
                      {isSuperAdmin && <option value="hybrid">Hybrid</option>}
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
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
                      <label htmlFor="has_price" className="text-sm text-gray-700">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
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
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* AI Suggestions Modal */}
          <EventSuggestionsModal
            isOpen={showSuggestionsModal}
            onClose={() => {
              setShowSuggestionsModal(false);
              setSuggestions(null);
              setPendingFormData(null);
              setShowModal(true);
            }}
            suggestions={suggestions}
            onAccept={handleAcceptSuggestions}
            onProceedWithout={handleProceedWithout}
            loading={loadingSuggestions}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
