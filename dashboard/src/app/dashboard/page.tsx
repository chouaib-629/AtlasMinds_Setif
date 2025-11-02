'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { apiService } from '@/lib/api';
import {
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Video,
  Trophy,
} from 'lucide-react';

export default function DashboardPage() {
  const { admin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalUsers: 0,
    totalInscriptions: 0,
    activeChats: 0,
    activeLivestreams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load statistics (you'll need to create these endpoints in the backend)
        const [eventsRes, participantsRes, usersRes, inscriptionsRes, chatsRes, livestreamsRes] = await Promise.all([
          apiService.getEvents(isSuperAdmin ? {} : { type: 'local', attendance_type: 'in-person' }),
          apiService.getParticipants(),
          apiService.getUsers(),
          apiService.getEventInscriptions(),
          apiService.getChats(),
          apiService.getLivestreams(),
        ]);

        setStats({
          totalEvents: eventsRes.data?.events?.length || 0,
          totalParticipants: participantsRes.data?.participants?.length || 0,
          totalInscriptions: inscriptionsRes.data?.inscriptions?.length || 0,
          activeChats: chatsRes.data?.chats?.filter((c: any) => c.is_active)?.length || 0,
          activeLivestreams: livestreamsRes.data?.livestreams?.filter((l: any) => l.is_live)?.length || 0,
          totalUsers: usersRes.data?.users?.length || 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isSuperAdmin]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-2xl font-semibold mb-2">
              Welcome back, {admin?.name}!
            </h2>
            <p className="text-indigo-100">
              {isSuperAdmin
                ? 'Manage national events, virtual house, and all participants across Algeria'
                : 'Manage your youth house events, local activities, and assigned participants'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Events
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {loading ? '...' : stats.totalEvents}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isSuperAdmin ? 'All events' : 'Local events'}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Participants
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {loading ? '...' : stats.totalParticipants}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isSuperAdmin ? 'All users' : 'House members'}
                  </p>
                </div>
                <Users className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Inscriptions
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {loading ? '...' : stats.totalInscriptions}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Event registrations
                  </p>
                </div>
                <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Chats
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {loading ? '...' : stats.activeChats}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Currently active
                  </p>
                </div>
                <MessageSquare className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Live Streams
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {loading ? '...' : stats.activeLivestreams}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Currently live
                  </p>
                </div>
                <Video className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/dashboard/events"
                  className="flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <Calendar className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    Manage Events & Activities
                  </span>
                </a>
                <a
                  href="/dashboard/participants"
                  className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Users className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    View Participants
                  </span>
                </a>
                <a
                  href="/dashboard/leaderboard"
                  className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                >
                  <Trophy className="h-5 w-5 mr-3 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    View Leaderboard
                  </span>
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Role Information
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Your Role
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {isSuperAdmin ? 'Super Admin' : 'Youth House Director'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Access Level
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {isSuperAdmin
                      ? 'National & Virtual House'
                      : 'Local Youth House'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {admin?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
