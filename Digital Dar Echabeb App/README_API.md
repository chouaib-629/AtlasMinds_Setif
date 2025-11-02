# API Integration Guide

This document describes the API integration for the Digital Dar Echabeb App with the Laravel backend.

## Configuration

### Environment Variables

Create a `.env` file in the root of the Digital Dar Echabeb App directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Important:** Update `VITE_API_BASE_URL` to match your backend API URL. For production, use your actual backend domain.

### API Structure

The API integration is organized in the following structure:

```
src/lib/api/
├── config.ts       # API configuration and endpoints
├── client.ts       # Axios client with interceptors
├── auth.ts         # Authentication service
└── index.ts        # Exports all API modules
```

## Authentication

### Using the Auth Context

The app includes an `AuthProvider` that wraps the application and provides authentication state:

```tsx
import { useAuth } from './lib/authContext';

function MyComponent() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  
  // Use authentication functions
}
```

### Available Auth Methods

- `login(credentials)` - Login with email and password
- `register(data)` - Register a new user
- `logout()` - Logout the current user
- `refreshUser()` - Refresh current user data
- `forgotPassword(data)` - Request password reset
- `resetPassword(data)` - Reset password with token

### Auth State

- `user` - Current authenticated user object or null
- `isAuthenticated` - Boolean indicating if user is logged in
- `isLoading` - Boolean indicating if auth is being initialized

## API Client

The API client automatically:
- Adds JWT tokens to request headers
- Handles token refresh on 401 errors
- Manages token storage in localStorage
- Provides error handling utilities

### Making API Calls

```tsx
import apiClient from './lib/api/client';

// GET request
const response = await apiClient.get('/endpoint');

// POST request
const response = await apiClient.post('/endpoint', data);
```

## Backend Endpoints

### Public Endpoints (No Auth Required)

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password

### Protected Endpoints (Require JWT Token)

- `GET /api/me` - Get current user
- `POST /api/logout` - Logout user
- `POST /api/refresh` - Refresh JWT token

### Admin Endpoints (Require Admin JWT Token)

All admin endpoints are prefixed with `/api/admin`:
- Events management
- Payments management
- Participants management
- Leaderboard
- Chats
- Livestreams
- Event inscriptions

See `backend/API_ENDPOINTS_COMPLETE.md` for complete admin endpoint documentation.

## Error Handling

The API client provides error handling:

```tsx
import { getErrorMessage } from './lib/api/client';

try {
  await authService.login(credentials);
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

## Token Management

JWT tokens are automatically:
- Stored in localStorage on successful login/registration
- Added to all authenticated requests
- Refreshed automatically when expired
- Cleared on logout

## Example Usage

### Login Screen

```tsx
import { useAuth } from './lib/authContext';
import { toast } from 'sonner@2.0.3';

function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Login successful');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
}
```

### Accessing User Data

```tsx
import { useAuth } from './lib/authContext';

function ProfileScreen() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Wilaya: {user.wilaya}</p>
    </div>
  );
}
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors, make sure your Laravel backend allows requests from your frontend domain. Update `config/cors.php` in your Laravel backend.

### Connection Issues

1. Verify the `VITE_API_BASE_URL` in your `.env` file matches your backend URL
2. Ensure your Laravel backend is running
3. Check browser console for detailed error messages

### Token Issues

- If tokens are not being stored, check browser localStorage
- If authentication fails, verify JWT secret in Laravel config matches
- Check backend logs for authentication errors

## Next Steps

To extend the API integration:

1. Add new service files in `src/lib/api/` (e.g., `events.ts`, `payments.ts`)
2. Export them from `src/lib/api/index.ts`
3. Use them in your components

Example:

```tsx
// src/lib/api/events.ts
import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const eventsService = {
  async getEvents() {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.EVENTS);
    return response.data;
  }
};
```

