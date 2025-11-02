import apiClient, { ApiResponse, getErrorMessage } from './client';
import { API_CONFIG, API_ENDPOINTS } from './config';

// User types matching backend response
export interface User {
  id: number;
  name: string;
  nom: string;
  prenom: string;
  email: string;
  date_de_naissance?: string;
  adresse?: string;
  commune?: string;
  wilaya?: string;
  numero_telephone?: string;
  score?: number;
  attended_events_count?: number;
  preferences?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  date_de_naissance: string;
  adresse: string;
  commune: string;
  wilaya: string;
  numero_telephone: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in?: number;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePreferencesData {
  preferences: string[];
}

// Authentication service
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      
      if (response.data.success && response.data.data) {
        // Store token and user data
        localStorage.setItem(API_CONFIG.TOKEN_KEY, response.data.data.token);
        localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      if (response.data.success && response.data.data) {
        // Store token and user data
        localStorage.setItem(API_CONFIG.TOKEN_KEY, response.data.data.token);
        localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.AUTH.ME
      );
      
      if (response.data.success && response.data.data?.user) {
        // Update stored user data
        localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Clear token and user data
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      localStorage.removeItem(API_CONFIG.USER_KEY);
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; token_type: string; expires_in: number }>> {
    try {
      const response = await apiClient.post<ApiResponse<{ token: string; token_type: string; expires_in: number }>>(
        API_ENDPOINTS.AUTH.REFRESH
      );
      
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem(API_CONFIG.TOKEN_KEY, response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  },

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem(API_CONFIG.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Update user preferences
   */
  async updatePreferences(data: UpdatePreferencesData): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.put<ApiResponse<{ user: User }>>(
        '/preferences',
        data
      );
      
      if (response.data.success && response.data.data?.user) {
        localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.USER_KEY);
  },
};

