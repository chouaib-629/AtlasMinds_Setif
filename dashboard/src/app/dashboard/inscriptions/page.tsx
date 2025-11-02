'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, EventInscription } from '@/lib/api';
import { Check, X } from 'lucide-react';

type InscriptionType = 'events' | 'education' | 'clubs' | 'direct-activities';

interface Inscription extends EventInscription {
  education?: any;
  club?: any;
  directActivity?: any;
}

export default function InscriptionsPage() {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<InscriptionType>('events');
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityFilter, setActivityFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadInscriptions();
    loadActivities();
  }, [activeTab, activityFilter, statusFilter]);

  const loadInscriptions = async () => {
    try {
      setLoading(true);
      let response;
      const activityId = activityFilter ? Number(activityFilter) : undefined;
      const status = statusFilter || undefined;

      switch (activeTab) {
        case 'events':
          response = await apiService.getEventInscriptions(activityId, status);
          break;
        case 'education':
          response = await apiService.getEducationInscriptions(activityId, status);
          break;
        case 'clubs':
          response = await apiService.getClubInscriptions(activityId, status);
          break;
        case 'direct-activities':
          response = await apiService.getDirectActivityInscriptions(activityId, status);
          break;
        default:
          response = await apiService.getEventInscriptions();
      }

      if (response.success && response.data) {
        setInscriptions(response.data.inscriptions || []);
      }
    } catch (error) {
      console.error('Error loading inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      let response;
      switch (activeTab) {
        case 'events':
          response = await apiService.getEvents(
            isSuperAdmin ? {} : { type: 'local', attendance_type: 'in-person' }
          );
          if (response.success && response.data) {
            setActivities(response.data.events || []);
          }
          break;
        case 'education':
          response = await apiService.getEducations();
          if (response.success && response.data) {
            setActivities(response.data.educations || []);
          }
          break;
        case 'clubs':
          response = await apiService.getClubs();
          if (response.success && response.data) {
            setActivities(response.data.clubs || []);
          }
          break;
        case 'direct-activities':
          response = await apiService.getDirectActivities();
          if (response.success && response.data) {
            setActivities(response.data.direct_activities || []);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleStatusUpdate = async (inscriptionId: number, status: 'approved' | 'rejected' | 'attended') => {
    try {
      switch (activeTab) {
        case 'events':
          await apiService.updateInscriptionStatus(inscriptionId, status);
          break;
        case 'education':
          await apiService.updateEducationInscriptionStatus(inscriptionId, status);
          break;
        case 'clubs':
          await apiService.updateClubInscriptionStatus(inscriptionId, status);
          break;
        case 'direct-activities':
          await apiService.updateDirectActivityInscriptionStatus(inscriptionId, status);
          break;
      }
      loadInscriptions();
    } catch (error) {
      console.error('Error updating inscription status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update inscription status');
    }
  };

  const getActivityTitle = (inscription: Inscription) => {
    switch (activeTab) {
      case 'events':
        return inscription.event?.title || 'N/A';
      case 'education':
        return inscription.education?.title || 'N/A';
      case 'clubs':
        return inscription.club?.title || 'N/A';
      case 'direct-activities':
        return inscription.directActivity?.title || 'N/A';
      default:
        return 'N/A';
    }
  };

  const getActivityDate = (inscription: Inscription) => {
    switch (activeTab) {
      case 'events':
        return inscription.event?.date;
      case 'education':
        return inscription.education?.date;
      case 'clubs':
        return inscription.club?.date;
      case 'direct-activities':
        return inscription.directActivity?.date;
      default:
        return null;
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

  const tabs: { id: InscriptionType; label: string }[] = [
    { id: 'events', label: 'Events' },
    { id: 'education', label: 'Education' },
    { id: 'clubs', label: 'Clubs/Groups' },
    { id: 'direct-activities', label: 'Activities' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Inscriptions Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage participant registrations for all activities
              </p>
            </div>
          </div>

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

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setActivityFilter('');
                      setStatusFilter('');
                    }}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4 flex-wrap">
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value ? Number(e.target.value) : '')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                <option value="">All {activeTab === 'events' ? 'Events' : activeTab === 'education' ? 'Educations' : activeTab === 'clubs' ? 'Clubs' : 'Activities'}</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
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
              <div className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
                        Activity
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
                            {inscription.user?.prenom} {inscription.user?.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {inscription.user?.email}
                          </div>
                          {inscription.user?.wilaya && (
                            <div className="text-xs text-gray-500">
                              {inscription.user.wilaya}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {getActivityTitle(inscription)}
                          </div>
                          {getActivityDate(inscription) && (
                            <div className="text-xs text-gray-500">
                              {new Date(getActivityDate(inscription)).toLocaleDateString()}
                            </div>
                          )}
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
                          {inscription.status === 'approved' && (
                            <button
                              onClick={() => handleStatusUpdate(inscription.id, 'attended')}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-900"
                            >
                              Mark Attended
                            </button>
                          )}
                          {inscription.status !== 'pending' && inscription.status !== 'approved' && (
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
