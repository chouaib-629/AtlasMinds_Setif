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
    if (rank === 1) return 'bg-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 border-gray-300';
    if (rank === 3) return 'bg-orange-100 border-orange-300';
    return 'bg-white border-gray-200';
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Leaderboard
            </h2>
            <p className="text-gray-600 mt-1">
              {isSuperAdmin
                ? 'View global, Algeria-wide, or wilaya-specific leaderboards'
                : 'View leaderboard for your youth house participants'}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4 flex-wrap">
              {isSuperAdmin && (
                <>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as 'global' | 'algeria' | 'wilaya')}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
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
                      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Top 3 Highlight Cards */}
          {!loading && leaderboard.length >= 3 && (
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

          {/* Leaderboard Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block  rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No leaderboard data available</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wilaya
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Events Attended
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.user_id}
                        className={`border-l-4 ${getRankColor(entry.rank)}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-lg font-bold text-gray-900">
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.prenom} {entry.nom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {entry.wilaya}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-semibold text-indigo-600">
                            {entry.score} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

