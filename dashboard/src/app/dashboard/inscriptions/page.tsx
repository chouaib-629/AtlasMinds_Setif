'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, EventInscription, Event } from '@/lib/api';
import { Check, X } from 'lucide-react';

export default function InscriptionsPage() {
  const { isSuperAdmin } = useAuth();
  const [inscriptions, setInscriptions] = useState<EventInscription[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadInscriptions();
    loadEvents();
  }, [eventFilter, statusFilter]);

  const loadInscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEventInscriptions(
        eventFilter ? Number(eventFilter) : undefined,
        statusFilter || undefined
      );
      if (response.success && response.data) {
        setInscriptions(response.data.inscriptions);
      }
    } catch (error) {
      console.error('Error loading inscriptions:', error);
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

  const handleStatusUpdate = async (inscriptionId: number, status: 'approved' | 'rejected') => {
    try {
      await apiService.updateInscriptionStatus(inscriptionId, status);
      loadInscriptions();
    } catch (error) {
      console.error('Error updating inscription status:', error);
    }
  };

  const getStatusColor = (status: string) => {
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
                Event Inscriptions
              </h2>
              <p className="text-gray-600 mt-1">
                Manage participant registrations for events and activities
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4 flex-wrap">
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value ? Number(e.target.value) : '')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                <option value="">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="attended">Attended</option>
              </select>
            </div>
          </div>

          {/* Inscriptions List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block  rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : inscriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No inscriptions found</p>
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
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inscriptions.map((inscription) => (
                      <tr key={inscription.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {inscription.user.prenom} {inscription.user.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {inscription.user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {inscription.user.wilaya}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {inscription.event.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(inscription.event.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs w-fit">
                              {inscription.event.type}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs w-fit">
                              {inscription.event.attendance_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(inscription.status)}`}
                          >
                            {inscription.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(inscription.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {inscription.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusUpdate(inscription.id, 'approved')}
                                className="flex items-center gap-1 text-green-600 hover:text-green-900"
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(inscription.id, 'rejected')}
                                className="flex items-center gap-1 text-red-600 hover:text-red-900"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </div>
                          )}
                          {inscription.status !== 'pending' && (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">
                {inscriptions.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {inscriptions.filter((i) => i.status === 'pending').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Approved</div>
              <div className="text-2xl font-bold text-green-600">
                {inscriptions.filter((i) => i.status === 'approved').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Attended</div>
              <div className="text-2xl font-bold text-blue-600">
                {inscriptions.filter((i) => i.status === 'attended').length}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

