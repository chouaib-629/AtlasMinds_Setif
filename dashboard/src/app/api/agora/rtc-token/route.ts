import { NextRequest, NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { agoraConfig, validateAgoraConfig } from '@/lib/agora/config';

/**
 * Generate RTC Token for Agora Video Streaming
 * POST /api/agora/rtc-token
 * 
 * Body: {
 *   channelName: string,
 *   uid?: number (optional, defaults to 0),
 *   role?: 'broadcaster' | 'audience' (defaults to 'audience')
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Agora configuration
    const configValidation = validateAgoraConfig();
    if (!configValidation.valid) {
      return NextResponse.json(
        { success: false, message: configValidation.message },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { channelName, uid = 0, role = 'audience' } = body;

    // Validate required fields
    if (!channelName) {
      return NextResponse.json(
        { success: false, message: 'channelName is required' },
        { status: 400 }
      );
    }

    // Determine RTC role
    const rtcRole = role === 'broadcaster' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Generate token expiration timestamp (current time + expiration time)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + agoraConfig.tokenExpirationTime;

    // Generate RTC token
    const token = RtcTokenBuilder.buildTokenWithUid(
      agoraConfig.appId,
      agoraConfig.appCertificate,
      channelName,
      uid,
      rtcRole,
      expirationTimestamp
    );

    return NextResponse.json({
      success: true,
      data: {
        token,
        appId: agoraConfig.appId,
        channelName,
        uid,
        role,
        expirationTimestamp,
      },
    });
  } catch (error) {
    console.error('Error generating RTC token:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate RTC token',
      },
      { status: 500 }
    );
  }
}


