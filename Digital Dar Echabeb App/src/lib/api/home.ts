import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { ApiResponse } from './client';

// Types for home data
export interface HomeEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  centerName: string;
  centerId: string;
  organizerContact: string;
  date: string;
  time: string;
  status: 'live' | 'upcoming';
  image: string;
}

export interface LearningProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  centerName: string;
  centerId: string;
  organizerContact: string;
  image: string;
}

export interface CommunityProject {
  id: string;
  title: string;
  description: string;
  votes: number;
  targetAudience: string;
  centerName: string;
  centerId: string;
  organizerContact: string;
  image: string;
}

export interface HomeData {
  events: HomeEvent[];
  learning: LearningProgram[];
  community: CommunityProject[];
}

export const homeService = {
  /**
   * Get home page data
   */
  async getHomeData(): Promise<HomeData> {
    const response = await apiClient.get<ApiResponse<HomeData>>(API_ENDPOINTS.HOME);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch home data');
  },
};

