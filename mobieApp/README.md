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

## Next Steps

- Install additional packages: `expo install <package-name>`
- Connect to the Laravel backend API
- Add navigation (React Navigation)
- Implement authentication
- Add your app screens and components

