import { NextRequest, NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder } from 'agora-token';
import { agoraConfig, validateAgoraConfig } from '@/lib/agora/config';

/**
 * Generate both RTC and RTM tokens in a single request
 * POST /api/agora/tokens
 * 
 * Body: {
 *   channelName: string,
 *   userId: string,
 *   uid?: number (optional, defaults to 0),
 *   role?: 'broadcaster' | 'audience' (defaults to 'audience')
 * }
 * 
 * Returns both tokens for convenience
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Agora configuration
    const configValidation = validateAgoraConfig();
    if (!configValidation.valid) {
      return NextResponse.json(
        { success: false, message: configValidation.message },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { channelName, userId, uid = 0, role = 'audience' } = body;

    // Validate required fields
    if (!channelName) {
      return NextResponse.json(
        { success: false, message: 'channelName is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }

    // Determine RTC role
    const rtcRole = role === 'broadcaster' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Generate token expiration timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + agoraConfig.tokenExpirationTime;

    // Generate RTC token (for video)
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(
      agoraConfig.appId,
      agoraConfig.appCertificate,
      channelName,
      uid,
      rtcRole,
      expirationTimestamp,
      expirationTimestamp
    );

    // Generate RTM token (for chat)
    // Note: RTM tokens don't use roles - they're simpler than RTC tokens
    const rtmToken = RtmTokenBuilder.buildToken(
      agoraConfig.appId,
      agoraConfig.appCertificate,
      userId,
      expirationTimestamp
    );

    return NextResponse.json({
      success: true,
      data: {
        rtcToken,
        rtmToken,
        appId: agoraConfig.appId,
        channelName,
        userId,
        uid,
        role,
        expirationTimestamp,
      },
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error generating tokens:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate tokens',
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


