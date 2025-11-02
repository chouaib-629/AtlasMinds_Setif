# Map Configuration

## Real Map Setup

The map screen now displays a **real interactive map** with all 296 youth centers across Algeria.

### Platform Support

#### iOS
- Uses **Apple Maps** by default (no API key required)
- Shows real map tiles with streets, cities, and geographical features
- Fully interactive with zoom, pan, and rotation

#### Android
- Uses **Google Maps** (requires API key for full functionality)
- To enable Google Maps on Android:

1. Get a Google Maps API Key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Maps SDK for Android"
   - Create an API key

2. Update `app.json`:
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `app.json` with your actual API key

3. Rebuild the app:
   ```bash
   npx expo prebuild
   npx expo run:android
   ```

### Features

✅ Real map tiles showing actual geography
✅ 296 youth center markers across Algeria
✅ Interactive zoom, pan, and rotation
✅ User location (when permissions granted)
✅ Marker details on tap
✅ Automatic bounds calculation to show all centers

### Testing

- **iOS Simulator**: Works immediately with Apple Maps
- **Android Emulator**: Requires Google Maps API key
- **Physical Devices**: Work with respective native maps

### Note

The map uses the native map providers:
- **iOS**: Apple Maps (no configuration needed)
- **Android**: Google Maps (requires API key for production)

For development/testing, iOS devices will work immediately. Android will need the API key configured for the full map experience.

