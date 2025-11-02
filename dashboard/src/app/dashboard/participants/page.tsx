'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Participant, Event } from '@/lib/api';
import { X } from 'lucide-react';

export default function ParticipantsPage() {
  const { isSuperAdmin } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [attendance, setAttendance] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    event_id: '',
    wilaya: '',
  });

  useEffect(() => {
    loadParticipants();
    loadEvents();
  }, [filters]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.event_id) params.event_id = parseInt(filters.event_id);
      if (filters.wilaya) params.wilaya = filters.wilaya;

      const response = await apiService.getParticipants(params);
      if (response.success && response.data) {
        setParticipants(response.data.participants);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
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

  const loadAttendance = async (userId: number) => {
    try {
      const response = await apiService.getParticipantAttendance(userId);
      if (response.success && response.data) {
        setAttendance(response.data.events);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handleViewDetails = async (participant: Participant) => {
    setSelectedParticipant(participant);
    await loadAttendance(participant.id);
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'attended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Participants (Event Registrations)
              </h2>
              <p className="text-gray-600 mt-1">
                View participants registered for events and activities
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Event/Activity
                </label>
                <select
                  value={filters.event_id}
                  onChange={(e) => setFilters({ ...filters, event_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="">All Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Wilaya
                </label>
                <input
                  type="text"
                  placeholder="Enter Wilaya"
                  value={filters.wilaya}
                  onChange={(e) => setFilters({ ...filters, wilaya: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>
            </div>
            <button
              onClick={() => setFilters({ event_id: '', wilaya: '' })}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700"
            >
              Clear Filters
            </button>
          </div>

          {/* Participants Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block  rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : participants.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No participants found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event/Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <tr key={`${participant.id}-${participant.inscription_id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {participant.prenom} {participant.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {participant.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {participant.event_title || 'N/A'}
                          </div>
                          {participant.event_type && (
                            <div className="text-xs text-gray-500">
                              {participant.event_type}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {participant.commune}, {participant.wilaya}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(participant.inscription_status)}`}
                          >
                            {participant.inscription_status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-indigo-600">
                            {participant.score} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(participant)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Participant Details Modal */}
          {selectedParticipant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Participant Details: {selectedParticipant.prenom} {selectedParticipant.nom}
                  </h3>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">
                      {selectedParticipant.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {selectedParticipant.commune}, {selectedParticipant.wilaya}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Score</p>
                    <p className="font-semibold text-indigo-600">
                      {selectedParticipant.score} points
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Events Attended</p>
                    <p className="font-semibold text-gray-900">
                      {selectedParticipant.attended_events_count} events
                    </p>
                  </div>
                  {selectedParticipant.event_title && (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Registered Event</p>
                        <p className="font-semibold text-gray-900">
                          {selectedParticipant.event_title}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Registration Status</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedParticipant.inscription_status)}`}
                        >
                          {selectedParticipant.inscription_status || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Attendance History
                  </h4>
                  {attendance.length === 0 ? (
                    <p className="text-gray-500">No attendance records</p>
                  ) : (
                    <div className="space-y-2">
                      {attendance.map((event) => (
                        <div
                          key={event.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {event.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(event.date).toLocaleDateString()} - {event.type} ({event.attendance_type})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

