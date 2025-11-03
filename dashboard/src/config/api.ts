// API Configuration for Dashboard
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Admin authentication endpoints
  admin: {
    register: '/admin/register',
    login: '/admin/login',
    logout: '/admin/logout',
    me: '/admin/me',
    refresh: '/admin/refresh',
    forgotPassword: '/admin/forgot-password',
    resetPassword: '/admin/reset-password',
    updateProfile: '/admin/profile',
    changePassword: '/admin/change-password',
    settings: '/admin/settings',
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

