import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { ApiResponse } from './client';

// Types for livestream data
export interface Livestream {
  id: number;
  title: string;
  description: string | null;
  channel_name: string | null;
  stream_url: string | null;
  is_live: boolean;
  event_id: number | null;
  event_title: string | null;
  has_agora: boolean;
  created_at: string;
}

export interface AgoraTokens {
  appId: string;
  channelName: string;
  userId: string;
  uid: number;
  role: 'broadcaster' | 'audience';
  rtcToken: string;
  rtmToken: string;
  expirationTimestamp: number;
}

export interface AgoraConfig {
  appId: string;
}

export const livestreamService = {
  /**
   * Get all active livestreams
   */
  async getAllLivestreams(eventId?: number): Promise<Livestream[]> {
    const params = eventId ? { event_id: eventId } : {};
    const response = await apiClient.get<ApiResponse<{ livestreams: Livestream[] }>>(
      API_ENDPOINTS.LIVESTREAMS.GET_ALL,
      { params }
    );
    if (response.data.success && response.data.data) {
      return response.data.data.livestreams;
    }
    throw new Error(response.data.message || 'Failed to fetch livestreams');
  },

  /**
   * Get a specific livestream by ID
   */
  async getLivestream(id: number): Promise<Livestream> {
    console.log('[LivestreamService] Fetching livestream ID:', id);
    console.log('[LivestreamService] Endpoint:', API_ENDPOINTS.LIVESTREAMS.GET_ONE(id.toString()));
    
    try {
      const response = await apiClient.get<ApiResponse<{ livestream: Livestream }>>(
        API_ENDPOINTS.LIVESTREAMS.GET_ONE(id.toString())
      );
      
      console.log('[LivestreamService] Response:', response.data);
      
      if (response.data.success && response.data.data) {
        console.log('[LivestreamService] Livestream data:', response.data.data.livestream);
        return response.data.data.livestream;
      }
      
      const errorMsg = response.data.message || 'Failed to fetch livestream';
      console.error('[LivestreamService] Error:', errorMsg);
      throw new Error(errorMsg);
    } catch (error) {
      console.error('[LivestreamService] Exception:', error);
      throw error;
    }
  },

  /**
   * Get Agora tokens for viewing a livestream
   * Calls the dashboard API endpoint (same as what dashboard uses)
   */
  async getAgoraTokens(params: {
    channelName: string;
    userId: string;
    uid?: number;
    role?: 'broadcaster' | 'audience';
  }): Promise<AgoraTokens> {
    // Use dashboard API endpoint (same endpoint the dashboard uses internally)
    const dashboardApiUrl = import.meta.env.VITE_DASHBOARD_API_URL || 'http://localhost:3000/api';
    const tokenUrl = `${dashboardApiUrl}/agora/tokens`;
    
    console.log('[LivestreamService] Requesting Agora tokens from:', tokenUrl);
    console.log('[LivestreamService] Token params:', params);
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName: params.channelName,
          userId: params.userId,
          uid: params.uid || 0,
          role: params.role || 'audience',
        }),
      });

      console.log('[LivestreamService] Token response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[LivestreamService] Token error response:', errorData);
        throw new Error(errorData.message || `Failed to generate Agora tokens: ${response.status}`);
      }

      const data = await response.json();
      console.log('[LivestreamService] Token response data:', data);
      
      if (data.success && data.data) {
        console.log('[LivestreamService] Tokens received successfully');
        return data.data;
      }
      
      console.error('[LivestreamService] Invalid token response:', data);
      throw new Error(data.message || 'Failed to generate Agora tokens');
    } catch (error) {
      console.error('[LivestreamService] Token request exception:', error);
      throw error;
    }
  },

  /**
   * Get Agora configuration (app ID)
   */
  async getAgoraConfig(): Promise<AgoraConfig> {
    const response = await apiClient.get<ApiResponse<AgoraConfig>>(
      API_ENDPOINTS.AGORA.CONFIG
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch Agora config');
  },
};

