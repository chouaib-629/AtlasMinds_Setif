# React Native Mobile App (Expo)

This is a React Native mobile application built with Expo Go.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo Go app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the Expo development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

2. **Run on specific platform:**
   - iOS: `npm run ios` (requires macOS and Xcode)
   - Android: `npm run android` (requires Android Studio)
   - Web: `npm run web`

3. **Using Expo Go:**
   - Scan the QR code with:
     - **iOS**: Camera app
     - **Android**: Expo Go app
   - The app will load on your device

## Project Structure

- `App.js` - Main application component
- `app.json` - Expo configuration
- `assets/` - Images and static assets
- `package.json` - Dependencies and scripts

## Features

- ⚡ Expo SDK ~54.0.20
- 📱 React Native 0.81.5
- 🔄 Hot reload support
- 📦 Easy deployment with Expo

## Development

- The app uses Expo's development build system
- Changes are reflected immediately with hot reload
- No need for native builds during development

## Building for Production

When ready to build standalone apps:
```bash
expo build:android
expo build:ios
```

Or use EAS Build (Expo Application Services):
```bash
eas build --platform android
eas build --platform ios
```

## Authentication Setup

The app includes complete authentication functionality with JWT:

### Features Implemented
- ✅ User Registration
- ✅ User Login
- ✅ Forgot Password
- ✅ Token-based Authentication
- ✅ Auto Token Refresh
- ✅ Protected Routes

### API Configuration

1. **Update API Base URL** in `config/api.js`:
   - For iOS Simulator: `http://localhost:8000/api`
   - For Android Emulator: `http://10.0.2.2:8000/api`
   - For Physical Device: Use your computer's local IP address
     - Find your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
     - Example: `http://192.168.1.100:8000/api`

2. **Ensure Backend is Running**:
   ```bash
   cd ../backend
   php artisan serve
   ```

### Screens
- **LoginScreen** - User login with email and password
- **RegisterScreen** - New user registration
- **ForgotPasswordScreen** - Password reset request
- **HomeScreen** - Protected home screen (shown after login)

### Navigation Flow
- Unauthenticated users see: Login → Register → Forgot Password
- Authenticated users see: Home (with logout option)

## Project Structure

- `App.js` - Main application component with navigation
- `context/AuthContext.js` - Authentication state management
- `services/api.js` - API service with axios for backend communication
- `screens/` - All application screens
  - `LoginScreen.js`
  - `RegisterScreen.js`
  - `ForgotPasswordScreen.js`
  - `HomeScreen.js`
- `config/api.js` - API configuration and endpoints

