'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, LeaderboardEntry } from '@/lib/api';
import { Medal, Award, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const { isSuperAdmin } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<'global' | 'algeria' | 'wilaya'>(
    isSuperAdmin ? 'global' : 'wilaya'
  );
  const [wilayaFilter, setWilayaFilter] = useState<string>('');

  useEffect(() => {
    loadLeaderboard();
  }, [scope, wilayaFilter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const params: any = { scope };
      if (scope === 'wilaya' && wilayaFilter) {
        params.wilaya = wilayaFilter;
      }
      const response = await apiService.getLeaderboard(params);
      if (response.success && response.data) {
        setLeaderboard(response.data.leaderboard);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-500" />;
    return <span className="text-lg font-bold">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (rank === 2) return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    if (rank === 3) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Leaderboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isSuperAdmin
                ? 'View global, Algeria-wide, or wilaya-specific leaderboards'
                : 'View leaderboard for your youth house participants'}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex gap-4 flex-wrap">
              {isSuperAdmin && (
                <>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as 'global' | 'algeria' | 'wilaya')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="global">Global Leaderboard</option>
                    <option value="algeria">Algeria Leaderboard</option>
                    <option value="wilaya">Wilaya Leaderboard</option>
                  </select>
                  {scope === 'wilaya' && (
                    <input
                      type="text"
                      placeholder="Enter Wilaya Name"
                      value={wilayaFilter}
                      onChange={(e) => setWilayaFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No leaderboard data available</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Wilaya
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Events Attended
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.user_id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 ${getRankColor(entry.rank)}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.prenom} {entry.nom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.wilaya}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                            {entry.score} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.attended_events_count} events
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top 3 Highlight Cards */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <div
                  key={entry.user_id}
                  className={`rounded-lg shadow-lg p-6 ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                      : 'bg-gradient-to-br from-orange-400 to-orange-600'
                  } text-white`}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {index === 0 ? (
                        <Trophy className="h-10 w-10" />
                      ) : index === 1 ? (
                        <Award className="h-10 w-10" />
                      ) : (
                        <Medal className="h-10 w-10" />
                      )}
                    </div>
                    <div className="text-xl font-bold mb-1">
                      {entry.prenom} {entry.nom}
                    </div>
                    <div className="text-sm opacity-90 mb-3">{entry.wilaya}</div>
                    <div className="text-2xl font-bold">{entry.score} pts</div>
                    <div className="text-sm opacity-90 mt-1">
                      {entry.attended_events_count} events
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

