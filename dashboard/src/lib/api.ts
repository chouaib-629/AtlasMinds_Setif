import { API_BASE_URL, getApiUrl, API_ENDPOINTS } from '@/config/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  is_super_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  admin: Admin;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  type: 'national' | 'local' | 'online' | 'hybrid';
  attendance_type: 'online' | 'in-person' | 'hybrid';
  date: string;
  location?: string;
  youth_house_id?: number;
  price?: number;
  has_price: boolean;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  wilaya: string;
  commune: string;
  score: number;
  attended_events_count: number;
  inscription_id?: number;
  event_id?: number;
  event_title?: string;
  event_type?: string;
  inscription_status?: string;
  youth_house_id?: number;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  nom: string;
  prenom: string;
  email: string;
  wilaya: string;
  commune: string;
  numero_telephone?: string;
  date_de_naissance?: string;
  adresse?: string;
  score: number;
  attended_events_count: number;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  nom: string;
  prenom: string;
  wilaya: string;
  score: number;
  attended_events_count: number;
}

export interface Chat {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
  event_id?: number;
  youth_house_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Livestream {
  id: number;
  title: string;
  description?: string;
  stream_url: string;
  is_live: boolean;
  event_id?: number;
  youth_house_id?: number;
  created_at: string;
  updated_at: string;
}

export interface EventInscription {
  id: number;
  user_id: number;
  event_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'attended';
  user: Participant;
  event: Event;
  created_at: string;
}

export interface Payment {
  id: number;
  user_id: number;
  event_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  paid_at?: string;
  user: Participant;
  event: Event;
  created_at: string;
  updated_at: string;
}

class ApiService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(getApiUrl(endpoint), {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          errors: data.errors,
        };
      }

      return {
        success: true,
        ...data,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Admin Authentication Methods
  async adminLogin(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_ENDPOINTS.admin.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async adminLogout(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.admin.logout, {
      method: 'POST',
    });
  }

  async getAdminProfile(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.admin.me, {
      method: 'GET',
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string; token_type: string; expires_in: number }>> {
    return this.request(API_ENDPOINTS.admin.refresh, {
      method: 'POST',
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.admin.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, token: string, password: string, passwordConfirmation: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.admin.resetPassword, {
      method: 'POST',
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
  }

  // Events Methods
  async getEvents(params?: { type?: string; attendance_type?: string }): Promise<ApiResponse<{ events: Event[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.attendance_type) queryParams.append('attendance_type', params.attendance_type);
    const query = queryParams.toString();
    return this.request(`/admin/events${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getEvent(id: number): Promise<ApiResponse<{ event: Event }>> {
    return this.request(`/admin/events/${id}`, { method: 'GET' });
  }

  async createEvent(data: Partial<Event>): Promise<ApiResponse<{ event: Event }>> {
    return this.request('/admin/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: number, data: Partial<Event>): Promise<ApiResponse<{ event: Event }>> {
    return this.request(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: number): Promise<ApiResponse> {
    return this.request(`/admin/events/${id}`, { method: 'DELETE' });
  }

  // Participants Methods (inscriptions - users registered for events)
  async getParticipants(params?: { event_id?: number; wilaya?: string }): Promise<ApiResponse<{ participants: Participant[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.event_id) queryParams.append('event_id', params.event_id.toString());
    if (params?.wilaya) queryParams.append('wilaya', params.wilaya);
    const query = queryParams.toString();
    return this.request(`/admin/participants${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  // Users Methods (all users)
  async getUsers(params?: { wilaya?: string; commune?: string }): Promise<ApiResponse<{ users: User[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.wilaya) queryParams.append('wilaya', params.wilaya);
    if (params?.commune) queryParams.append('commune', params.commune);
    const query = queryParams.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getUser(id: number): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/admin/users/${id}`, { method: 'GET' });
  }

  async getParticipant(id: number): Promise<ApiResponse<{ participant: Participant }>> {
    return this.request(`/admin/participants/${id}`, { method: 'GET' });
  }

  async getParticipantAttendance(userId: number): Promise<ApiResponse<{ events: Event[] }>> {
    return this.request(`/admin/participants/${userId}/attendance`, { method: 'GET' });
  }

  // Leaderboard Methods
  async getLeaderboard(params?: { scope?: 'global' | 'algeria' | 'wilaya'; wilaya?: string }): Promise<ApiResponse<{ leaderboard: LeaderboardEntry[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.scope) queryParams.append('scope', params.scope);
    if (params?.wilaya) queryParams.append('wilaya', params.wilaya);
    const query = queryParams.toString();
    return this.request(`/admin/leaderboard${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  // Chats Methods
  async getChats(eventId?: number): Promise<ApiResponse<{ chats: Chat[] }>> {
    const query = eventId ? `?event_id=${eventId}` : '';
    return this.request(`/admin/chats${query}`, { method: 'GET' });
  }

  async createChat(data: Partial<Chat>): Promise<ApiResponse<{ chat: Chat }>> {
    return this.request('/admin/chats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChat(id: number, data: Partial<Chat>): Promise<ApiResponse<{ chat: Chat }>> {
    return this.request(`/admin/chats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChat(id: number): Promise<ApiResponse> {
    return this.request(`/admin/chats/${id}`, { method: 'DELETE' });
  }

  // Livestreams Methods
  async getLivestreams(eventId?: number): Promise<ApiResponse<{ livestreams: Livestream[] }>> {
    const query = eventId ? `?event_id=${eventId}` : '';
    return this.request(`/admin/livestreams${query}`, { method: 'GET' });
  }

  async createLivestream(data: Partial<Livestream>): Promise<ApiResponse<{ livestream: Livestream }>> {
    return this.request('/admin/livestreams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLivestream(id: number, data: Partial<Livestream>): Promise<ApiResponse<{ livestream: Livestream }>> {
    return this.request(`/admin/livestreams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLivestream(id: number): Promise<ApiResponse> {
    return this.request(`/admin/livestreams/${id}`, { method: 'DELETE' });
  }

  // Event Inscriptions Methods
  async getEventInscriptions(eventId?: number, status?: string): Promise<ApiResponse<{ inscriptions: EventInscription[] }>> {
    const queryParams = new URLSearchParams();
    if (eventId) queryParams.append('event_id', eventId.toString());
    if (status) queryParams.append('status', status);
    const query = queryParams.toString();
    return this.request(`/admin/event-inscriptions${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async updateInscriptionStatus(inscriptionId: number, status: 'approved' | 'rejected' | 'attended'): Promise<ApiResponse<{ inscription: EventInscription }>> {
    return this.request(`/admin/event-inscriptions/${inscriptionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Education Inscriptions Methods
  async getEducationInscriptions(educationId?: number, status?: string): Promise<ApiResponse<{ inscriptions: EventInscription[] }>> {
    const queryParams = new URLSearchParams();
    if (educationId) queryParams.append('education_id', educationId.toString());
    if (status) queryParams.append('status', status);
    const query = queryParams.toString();
    return this.request(`/admin/education-inscriptions${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async updateEducationInscriptionStatus(inscriptionId: number, status: 'approved' | 'rejected' | 'attended'): Promise<ApiResponse<{ inscription: EventInscription }>> {
    return this.request(`/admin/education-inscriptions/${inscriptionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Club Inscriptions Methods
  async getClubInscriptions(clubId?: number, status?: string): Promise<ApiResponse<{ inscriptions: EventInscription[] }>> {
    const queryParams = new URLSearchParams();
    if (clubId) queryParams.append('club_id', clubId.toString());
    if (status) queryParams.append('status', status);
    const query = queryParams.toString();
    return this.request(`/admin/club-inscriptions${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async updateClubInscriptionStatus(inscriptionId: number, status: 'approved' | 'rejected' | 'attended'): Promise<ApiResponse<{ inscription: EventInscription }>> {
    return this.request(`/admin/club-inscriptions/${inscriptionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Direct Activity Inscriptions Methods
  async getDirectActivityInscriptions(activityId?: number, status?: string): Promise<ApiResponse<{ inscriptions: EventInscription[] }>> {
    const queryParams = new URLSearchParams();
    if (activityId) queryParams.append('direct_activity_id', activityId.toString());
    if (status) queryParams.append('status', status);
    const query = queryParams.toString();
    return this.request(`/admin/direct-activity-inscriptions${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async updateDirectActivityInscriptionStatus(inscriptionId: number, status: 'approved' | 'rejected' | 'attended'): Promise<ApiResponse<{ inscription: EventInscription }>> {
    return this.request(`/admin/direct-activity-inscriptions/${inscriptionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Payments Methods
  async getPayments(params?: { event_id?: number; user_id?: number; status?: string; start_date?: string; end_date?: string }): Promise<ApiResponse<{ payments: Payment[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.event_id) queryParams.append('event_id', params.event_id.toString());
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    const query = queryParams.toString();
    return this.request(`/admin/payments${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getPayment(id: number): Promise<ApiResponse<{ payment: Payment }>> {
    return this.request(`/admin/payments/${id}`, { method: 'GET' });
  }

  async updatePaymentStatus(id: number, status: 'completed' | 'failed' | 'refunded'): Promise<ApiResponse<{ payment: Payment }>> {
    return this.request(`/admin/payments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Education CRUD Methods
  async getEducations(params?: { category?: string; status?: string; is_active?: boolean }): Promise<ApiResponse<{ educations: any[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    const query = queryParams.toString();
    return this.request(`/admin/educations${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getEducation(id: number): Promise<ApiResponse<{ education: any }>> {
    return this.request(`/admin/educations/${id}`, { method: 'GET' });
  }

  async createEducation(data: any): Promise<ApiResponse<{ education: any }>> {
    return this.request('/admin/educations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEducation(id: number, data: any): Promise<ApiResponse<{ education: any }>> {
    return this.request(`/admin/educations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEducation(id: number): Promise<ApiResponse> {
    return this.request(`/admin/educations/${id}`, { method: 'DELETE' });
  }

  // Club CRUD Methods
  async getClubs(params?: { category?: string; status?: string; is_active?: boolean }): Promise<ApiResponse<{ clubs: any[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    const query = queryParams.toString();
    return this.request(`/admin/clubs${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getClub(id: number): Promise<ApiResponse<{ club: any }>> {
    return this.request(`/admin/clubs/${id}`, { method: 'GET' });
  }

  async createClub(data: any): Promise<ApiResponse<{ club: any }>> {
    return this.request('/admin/clubs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClub(id: number, data: any): Promise<ApiResponse<{ club: any }>> {
    return this.request(`/admin/clubs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClub(id: number): Promise<ApiResponse> {
    return this.request(`/admin/clubs/${id}`, { method: 'DELETE' });
  }

  // Direct Activity CRUD Methods
  async getDirectActivities(params?: { category?: string; status?: string; is_active?: boolean }): Promise<ApiResponse<{ direct_activities: any[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    const query = queryParams.toString();
    return this.request(`/admin/direct-activities${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getDirectActivity(id: number): Promise<ApiResponse<{ direct_activity: any }>> {
    return this.request(`/admin/direct-activities/${id}`, { method: 'GET' });
  }

  async createDirectActivity(data: any): Promise<ApiResponse<{ direct_activity: any }>> {
    return this.request('/admin/direct-activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDirectActivity(id: number, data: any): Promise<ApiResponse<{ direct_activity: any }>> {
    return this.request(`/admin/direct-activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDirectActivity(id: number): Promise<ApiResponse> {
    return this.request(`/admin/direct-activities/${id}`, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();

