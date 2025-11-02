'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Participant } from '@/lib/api';
import { X } from 'lucide-react';

type ActivityType = 'events' | 'education' | 'clubs' | 'direct-activities';

interface ActivityParticipant extends Participant {
  activity_type?: string;
  activity_category?: string;
}

export default function ParticipantsPage() {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ActivityType>('events');
  const [participants, setParticipants] = useState<ActivityParticipant[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<ActivityParticipant | null>(null);
  const [filters, setFilters] = useState({
    activity_id: '',
    wilaya: '',
  });

  useEffect(() => {
    loadParticipants();
    loadActivities();
  }, [filters, activeTab]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      let response;
      const activityId = filters.activity_id ? Number(filters.activity_id) : undefined;
      const wilaya = filters.wilaya || undefined;

      switch (activeTab) {
        case 'events':
          const params: any = {};
          if (activityId) params.event_id = activityId;
          if (wilaya) params.wilaya = wilaya;
          response = await apiService.getParticipants(params);
          if (response.success && response.data) {
            setParticipants(response.data.participants || []);
          }
          break;
        case 'education':
          response = await apiService.getEducationInscriptions(activityId, undefined);
          if (response.success && response.data) {
            const inscriptions = response.data.inscriptions || [];
            setParticipants(transformInscriptions(inscriptions, 'education'));
          }
          break;
        case 'clubs':
          response = await apiService.getClubInscriptions(activityId, undefined);
          if (response.success && response.data) {
            const inscriptions = response.data.inscriptions || [];
            setParticipants(transformInscriptions(inscriptions, 'club'));
          }
          break;
        case 'direct-activities':
          response = await apiService.getDirectActivityInscriptions(activityId, undefined);
          if (response.success && response.data) {
            const inscriptions = response.data.inscriptions || [];
            setParticipants(transformInscriptions(inscriptions, 'direct_activity'));
          }
          break;
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformInscriptions = (inscriptions: any[], type: string): ActivityParticipant[] => {
    return inscriptions.map((inscription) => {
      const user = inscription.user || {};
      const activity = inscription.education || inscription.club || inscription.directActivity || {};
      
      // Filter by wilaya if specified
      if (filters.wilaya && user.wilaya !== filters.wilaya) {
        return null;
      }

      return {
        id: user.id || inscription.user_id,
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        wilaya: user.wilaya || '',
        commune: user.commune || '',
        score: user.score || 0,
        attended_events_count: user.attended_events_count || 0,
        inscription_id: inscription.id,
        event_id: activity.id,
        event_title: activity.title || 'N/A',
        activity_type: type,
        activity_category: activity.category,
        inscription_status: inscription.status,
        created_at: inscription.created_at,
      };
    }).filter((p): p is ActivityParticipant => p !== null);
  };

  const loadActivities = async () => {
    try {
      switch (activeTab) {
        case 'events':
          const eventsRes = await apiService.getEvents(
            isSuperAdmin ? {} : { type: 'local', attendance_type: 'in-person' }
          );
          if (eventsRes.success && eventsRes.data) {
            setActivities(eventsRes.data.events || []);
          }
          break;
        case 'education':
          const educationsRes = await apiService.getEducations();
          if (educationsRes.success && educationsRes.data) {
            setActivities(educationsRes.data.educations || []);
          }
          break;
        case 'clubs':
          const clubsRes = await apiService.getClubs();
          if (clubsRes.success && clubsRes.data) {
            setActivities(clubsRes.data.clubs || []);
          }
          break;
        case 'direct-activities':
          const activitiesRes = await apiService.getDirectActivities();
          if (activitiesRes.success && activitiesRes.data) {
            setActivities(activitiesRes.data.direct_activities || []);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
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

  const tabs = [
    { id: 'events' as ActivityType, label: 'Events' },
    { id: 'education' as ActivityType, label: 'Education' },
    { id: 'clubs' as ActivityType, label: 'Clubs/Groups' },
    { id: 'direct-activities' as ActivityType, label: 'Activities' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Participants
              </h2>
              <p className="text-gray-600 mt-1">
                View participants registered for activities
              </p>
            </div>
          </div>

                    {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total Participants</div>
              <div className="text-2xl font-bold text-gray-900">
                {participants.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Approved</div>
              <div className="text-2xl font-bold text-green-600">
                {participants.filter((p) => p.inscription_status === 'approved').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {participants.filter((p) => p.inscription_status === 'pending').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Attended</div>
              <div className="text-2xl font-bold text-blue-600">
                {participants.filter((p) => p.inscription_status === 'attended').length}
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
                      setFilters({ activity_id: '', wilaya: '' });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by {activeTab === 'events' ? 'Event' : activeTab === 'education' ? 'Education' : activeTab === 'clubs' ? 'Club' : 'Activity'}
                </label>
                <select
                  value={filters.activity_id}
                  onChange={(e) => setFilters({ ...filters, activity_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="">All {activeTab === 'events' ? 'Events' : activeTab === 'education' ? 'Educations' : activeTab === 'clubs' ? 'Clubs' : 'Activities'}</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.title}
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
              onClick={() => setFilters({ activity_id: '', wilaya: '' })}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700"
            >
              Clear Filters
            </button>
          </div>

          {/* Participants Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
                        Activity
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
                          {participant.activity_category && (
                            <div className="text-xs text-gray-500">
                              {participant.activity_category}
                            </div>
                          )}
                          {participant.activity_type && (
                            <div className="text-xs text-gray-500">
                              Type: {participant.activity_type}
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
                            onClick={() => setSelectedParticipant(participant)}
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                        <p className="text-sm text-gray-600">Registered Activity</p>
                        <p className="font-semibold text-gray-900">
                          {selectedParticipant.event_title}
                        </p>
                        {selectedParticipant.activity_category && (
                          <p className="text-xs text-gray-500 mt-1">
                            Category: {selectedParticipant.activity_category}
                          </p>
                        )}
                        {selectedParticipant.activity_type && (
                          <p className="text-xs text-gray-500">
                            Type: {selectedParticipant.activity_type}
                          </p>
                        )}
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
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
