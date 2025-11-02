// API Configuration
// For testing on physical device or emulator:
// - iOS Simulator: use 'http://localhost:8000/api'
// - Android Emulator: use 'http://10.0.2.2:8000/api'
// - Physical Device: use your computer's local IP (e.g., 'http://192.168.1.100:8000/api')
//   To find your IP: ifconfig (Mac/Linux) or ipconfig (Windows)

export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api'  // Development - update this if testing on physical device
  : 'https://your-production-url.com/api'; // Production URL

export const API_ENDPOINTS = {
  register: '/register',
  login: '/login',
  logout: '/logout',
  me: '/me',
  refresh: '/refresh',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  // Home activities
  homeActivities: '/home-activities',
  educations: '/educations',
  educationsFeatured: '/educations/featured',
  clubs: '/clubs',
  clubsFeatured: '/clubs/featured',
  directActivities: '/direct-activities',
  directActivitiesFeatured: '/direct-activities/featured',
};

