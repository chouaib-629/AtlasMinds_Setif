# Agora Live Streaming Integration

This document explains how to set up and use the Agora live streaming integration in the dashboard.

## Overview

The integration uses Agora's two-SDK model:
- **Agora RTC SDK**: For high-bandwidth video and audio streaming
- **Agora Chat/RTM SDK**: For low-latency text messaging and interactions

## Prerequisites

1. **Agora Account**: Sign up at [https://www.agora.io](https://www.agora.io)
2. **Agora App ID**: Create an app in your Agora dashboard
3. **Agora App Certificate**: Get your App Certificate from the Agora dashboard (required for token generation)

## Server-Side Setup

### 1. Install Dependencies

The Agora token generation package is already installed:
```bash
npm install agora-token
```

### 2. Environment Variables

Add the following to your `.env.local` file in the dashboard directory:

```env
# Agora Configuration
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_app_certificate_here
```

**Important**: 
- Never commit these credentials to version control
- The App Certificate is sensitive and should be kept secure
- These values are used server-side only for token generation

### 3. Database Migration

Run the migration to add the `channel_name` field to the livestreams table:

```bash
cd backend
php artisan migrate
```

This will add a `channel_name` column to the `livestreams` table to store Agora channel names.

## API Endpoints

The server exposes three Next.js API routes for token generation:

### 1. Generate RTC Token (Video)

**Endpoint**: `POST /api/agora/rtc-token`

**Body**:
```json
{
  "channelName": "livestream-1",
  "uid": 0,
  "role": "broadcaster" // or "audience"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "rtc_token_here",
    "appId": "your_app_id",
    "channelName": "livestream-1",
    "uid": 0,
    "role": "broadcaster",
    "expirationTimestamp": 1234567890
  }
}
```

### 2. Generate RTM Token (Chat)

**Endpoint**: `POST /api/agora/rtm-token`

**Body**:
```json
{
  "userId": "admin-123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "rtm_token_here",
    "appId": "your_app_id",
    "userId": "admin-123",
    "expirationTimestamp": 1234567890
  }
}
```

### 3. Generate Both Tokens

**Endpoint**: `POST /api/agora/tokens`

**Body**:
```json
{
  "channelName": "livestream-1",
  "userId": "admin-123",
  "uid": 0,
  "role": "broadcaster"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "rtcToken": "rtc_token_here",
    "rtmToken": "rtm_token_here",
    "appId": "your_app_id",
    "channelName": "livestream-1",
    "userId": "admin-123",
    "uid": 0,
    "role": "broadcaster",
    "expirationTimestamp": 1234567890
  }
}
```

## Dashboard Usage

### Creating an Agora Livestream

1. Navigate to **Dashboard → Livestreams**
2. Click **"+ Create Livestream"**
3. Fill in the title and description
4. **Check "Use Agora (Real-time streaming)"**
5. Optionally set a channel name (auto-generated if empty)
6. Associate with an event (optional)
7. Click **"Create"**

### Getting Tokens

1. Find your Agora livestream in the list
2. Click the **Video icon** (green) on the livestream card
3. A modal will display:
   - App ID
   - Channel Name
   - RTC Token (for video)
   - RTM Token (for chat)
4. Copy these tokens to use in your mobile app

### Token Expiration

- Tokens are valid for **24 hours** by default
- Generate new tokens when they expire
- The expiration timestamp is included in the response

## Mobile App Integration

### For Host (Broadcaster)

```typescript
// 1. Initialize RTC Engine
const engine = RtcEngine.create({
  appId: 'your_app_id',
});

// 2. Set channel profile
engine.setChannelProfile(ChannelProfile.LiveBroadcasting);

// 3. Set client role to Broadcaster
engine.setClientRole(ClientRole.Broadcaster);

// 4. Join channel with RTC token
await engine.joinChannel(rtcToken, channelName, uid);

// 5. Enable local video
engine.enableVideo();
engine.startPreview();

// 6. Render local view
<RtcLocalView.SurfaceView />

// 7. Initialize Chat Client for messaging
const chatClient = ChatClient.getInstance();
await chatClient.login(userId, rtmToken);

// 8. Join chat room
await chatClient.roomManager.joinChatRoom(channelName);
```

### For Audience (Viewers)

```typescript
// 1. Initialize RTC Engine
const engine = RtcEngine.create({
  appId: 'your_app_id',
});

// 2. Set channel profile
engine.setChannelProfile(ChannelProfile.LiveBroadcasting);

// 3. Set client role to Audience
engine.setClientRole(ClientRole.Audience);

// 4. Listen for host joining
engine.on('userJoined', (uid) => {
  setHostUid(uid);
});

// 5. Join channel with RTC token
await engine.joinChannel(rtcToken, channelName, 0);

// 6. Render remote view when host joins
{hostUid && <RtcRemoteView.SurfaceView uid={hostUid} />}

// 7. Initialize Chat Client
const chatClient = ChatClient.getInstance();
await chatClient.login(userId, rtmToken);

// 8. Join chat room for messaging
await chatClient.roomManager.joinChatRoom(channelName);
```

## Architecture Notes

1. **Two-SDK Model**: The app uses both RTC (video) and RTM (chat) SDKs simultaneously
2. **Channel Naming**: Channels follow the pattern `livestream-{id}` where `id` is the livestream database ID
3. **Token Security**: Tokens are generated server-side to keep certificates secure
4. **Role-Based**: Host uses `Broadcaster` role, viewers use `Audience` role
5. **Channel Profile**: Always use `LiveBroadcasting` for one-to-many streaming

## Troubleshooting

### Token Generation Fails

- Check that `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE` are set in `.env.local`
- Verify your Agora credentials in the Agora dashboard
- Check server logs for detailed error messages

### Channel Name Issues

- Channel names must be unique
- Auto-generated names use format: `livestream-{id}`
- Channel names are case-sensitive

### Token Expiration

- Tokens expire after 24 hours
- Regenerate tokens when they expire
- The expiration timestamp is included in API responses

## Next Steps

1. Set up your Agora account and get credentials
2. Add environment variables to `.env.local`
3. Run database migration
4. Create an Agora livestream in the dashboard
5. Get tokens and integrate with mobile app

## Security Best Practices

- Never expose `AGORA_APP_CERTIFICATE` in client-side code
- Always generate tokens server-side
- Rotate certificates if compromised
- Use token expiration to limit exposure
- Validate channel access server-side if needed


