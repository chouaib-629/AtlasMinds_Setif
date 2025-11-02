import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { ApiResponse } from './client';

// Types for leaderboard data
export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  nom: string;
  prenom: string;
  wilaya: string;
  score: number;
  attended_events_count: number;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
}

export const leaderboardService = {
  /**
   * Get leaderboard data
   * @param scope - 'algeria', 'wilaya', or 'commune'
   * @param wilaya - Required wilaya filter when scope is 'wilaya' or 'commune'
   * @param commune - Required commune filter when scope is 'commune'
   */
  async getLeaderboard(scope: 'algeria' | 'wilaya' | 'commune' = 'algeria', wilaya?: string, commune?: string): Promise<LeaderboardData> {
    const params: any = { scope };
    if ((scope === 'wilaya' || scope === 'commune') && wilaya) {
      params.wilaya = wilaya;
    }
    if (scope === 'commune' && commune) {
      params.commune = commune;
    }
    
    const response = await apiClient.get<ApiResponse<LeaderboardData>>(API_ENDPOINTS.LEADERBOARD, { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch leaderboard data');
  },
};

