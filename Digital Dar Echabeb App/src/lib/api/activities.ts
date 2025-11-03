import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { ApiResponse } from './client';

// Types for activity details
export interface ActivityDetail {
  id: number;
  type: 'education' | 'club' | 'direct_activity';
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendance_type: string;
  organizer: string;
  organizer_contact: string;
  center_id: string;
  center_name: string;
  has_price: boolean;
  price: number | null;
  participants: number;
  capacity: number | null;
  image_url: string | null;
  status?: string;
  duration?: string;
  level?: string;
  votes?: number;
  target_audience?: string;
  is_registered?: boolean;
  registration_status?: 'pending' | 'approved' | 'rejected' | 'attended';
  allowsSubmissions?: boolean;
}

export const activitiesService = {
  /**
   * Get activity details by parsing the activity ID
   * Activity ID format: "{type}_{id}" (e.g., "education_1", "club_2", "learning_3", "community_4")
   */
  async getActivityDetail(activityId: string): Promise<ActivityDetail> {
    // Parse activity ID to get type and ID
    const parts = activityId.split('_');
    if (parts.length < 2) {
      throw new Error(`Invalid activity ID format: ${activityId}. Expected format: "{type}_{id}"`);
    }
    
    const typePrefix = parts[0];
    const id = parts.slice(1).join('_'); // Handle IDs that might contain underscores
    
    let endpoint = '';
    
    // Map prefixes to endpoints
    if (typePrefix === 'education' || typePrefix === 'learning') {
      endpoint = `${API_ENDPOINTS.ACTIVITIES.EDUCATION}/${id}`;
    } else if (typePrefix === 'club') {
      endpoint = `${API_ENDPOINTS.ACTIVITIES.CLUB}/${id}`;
    } else if (typePrefix === 'direct_activity' || typePrefix === 'community' || typePrefix === 'direct') {
      endpoint = `${API_ENDPOINTS.ACTIVITIES.DIRECT_ACTIVITY}/${id}`;
    } else {
      throw new Error(`Unknown activity type: ${typePrefix}`);
    }
    
    try {
      const response = await apiClient.get<ApiResponse<ActivityDetail>>(endpoint);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch activity details');
    } catch (error) {
      // Log the error for debugging
      console.error(`[ActivityService] Failed to fetch activity ${activityId}:`, error);
      throw error;
    }
  },

  /**
   * Join/Register for an activity
   */
  async joinActivity(activityId: string): Promise<{ participants: number; capacity: number | null }> {
    // Parse activity ID to get type and ID
    const [typePrefix, id] = activityId.split('_');
    
    let endpoint = '';
    
    // Map prefixes to endpoints
    if (typePrefix === 'education' || typePrefix === 'learning') {
      endpoint = `${API_ENDPOINTS.ACTIVITIES.EDUCATION}/${id}/join`;
    } else if (typePrefix === 'club') {
      endpoint = `${API_ENDPOINTS.ACTIVITIES.CLUB}/${id}/join`;
    } else if (typePrefix === 'direct_activity' || typePrefix === 'community') {
      endpoint = `${API_ENDPOINTS.ACTIVITIES.DIRECT_ACTIVITY}/${id}/join`;
    } else {
      throw new Error(`Unknown activity type: ${typePrefix}`);
    }
    
    const response = await apiClient.post<ApiResponse<{ participants: number; capacity: number | null }>>(endpoint);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to join activity');
  },
};

