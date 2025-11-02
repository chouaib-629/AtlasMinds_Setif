// API Configuration
export const API_CONFIG = {
  // Backend API base URL - update this to match your Laravel backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Token storage key
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/login',
    LOGOUT: '/logout',
    ME: '/me',
    REFRESH: '/refresh',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  
  // Admin endpoints (for future use)
  ADMIN: {
    BASE: '/admin',
    EVENTS: '/admin/events',
    PAYMENTS: '/admin/payments',
    PARTICIPANTS: '/admin/participants',
    LEADERBOARD: '/admin/leaderboard',
    CHATS: '/admin/chats',
    LIVESTREAMS: '/admin/livestreams',
    EVENT_INSCRIPTIONS: '/admin/event-inscriptions',
  },
};

