# Map Setup Instructions

## Important: react-native-maps requires a custom build

The map will **NOT** work in Expo Go. You need to create a **custom development build**.

### Option 1: Create Development Build (Recommended)

```bash
cd mobieApp

# For iOS
npx expo prebuild
npx expo run:ios

# For Android
npx expo prebuild
npx expo run:android
```

### Option 2: Use EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for development
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

### Option 3: Test on Web (Limited - List View Only)

The map will show a list view on web:
```bash
npm start
# Press 'w' for web
```

## Troubleshooting

If map is blank/not showing:

1. **Check console logs** - Look for "Map is ready" message
2. **Ensure prebuild is done** - Run `npx expo prebuild`
3. **Rebuild app** - Maps require native compilation
4. **Check permissions** - Location permissions may be needed

## Android Google Maps API Key

For Android, you need to add your Google Maps API key in `app.json`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_ACTUAL_API_KEY_HERE"
    }
  }
}
```

Then rebuild:
```bash
npx expo prebuild
npx expo run:android
```

