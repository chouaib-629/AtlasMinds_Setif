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
  register: async (registerData) => {
    const response = await api.post(API_ENDPOINTS.register, {
      nom: registerData.nom,
      prenom: registerData.prenom,
      date_de_naissance: registerData.date_de_naissance,
      adresse: registerData.adresse,
      commune: registerData.commune,
      wilaya: registerData.wilaya,
      numero_telephone: registerData.numero_telephone,
      email: registerData.email,
      password: registerData.password,
      password_confirmation: registerData.password_confirmation,
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
      const response = await api.post(API_ENDPOINTS.logout);
      return response.data;
    } catch (error) {
      // Don't clear storage here - let AuthContext handle it
      throw error;
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

// Activities API (public, no auth required)
export const activitiesAPI = {
  // Get all home activities (education, clubs, direct activities)
  getHomeActivities: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.homeActivities);
      return response.data;
    } catch (error) {
      console.error('Error fetching home activities:', error);
      throw error;
    }
  },

  // Get educations
  getEducations: async (featured = false) => {
    try {
      const endpoint = featured ? API_ENDPOINTS.educationsFeatured : API_ENDPOINTS.educations;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching educations:', error);
      throw error;
    }
  },

  // Get clubs
  getClubs: async (featured = false) => {
    try {
      const endpoint = featured ? API_ENDPOINTS.clubsFeatured : API_ENDPOINTS.clubs;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }
  },

  // Get direct activities
  getDirectActivities: async (featured = false) => {
    try {
      const endpoint = featured ? API_ENDPOINTS.directActivitiesFeatured : API_ENDPOINTS.directActivities;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching direct activities:', error);
      throw error;
    }
  },
};

export default api;

