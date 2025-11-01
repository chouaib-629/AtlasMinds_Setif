import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('authToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}${API_ENDPOINTS.refresh}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const newToken = response.data.data.token;
          await AsyncStorage.setItem('authToken', newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  // Register
  register: async (name, email, password, passwordConfirmation) => {
    const response = await api.post(API_ENDPOINTS.register, {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.login, {
      email,
      password,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.logout);
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.log('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
  },

  // Get current user
  getMe: async () => {
    const response = await api.get(API_ENDPOINTS.me);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post(API_ENDPOINTS.forgotPassword, {
      email,
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (email, token, password, passwordConfirmation) => {
    const response = await api.post(API_ENDPOINTS.resetPassword, {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },
};

export default api;

