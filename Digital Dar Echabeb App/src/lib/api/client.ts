import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
        if (token) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REFRESH}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const newToken = response.data.data?.token;
          if (newToken) {
            localStorage.setItem(API_CONFIG.TOKEN_KEY, newToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        localStorage.removeItem(API_CONFIG.TOKEN_KEY);
        localStorage.removeItem(API_CONFIG.USER_KEY);
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// API Error type
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Helper function to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    if (axiosError.response?.data) {
      const apiResponse = axiosError.response.data;
      if (apiResponse.message) {
        return apiResponse.message;
      }
      if (apiResponse.errors) {
        const firstError = Object.values(apiResponse.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
    }
    return axiosError.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default apiClient;

