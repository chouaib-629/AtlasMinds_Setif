import { NextRequest, NextResponse } from 'next/server';
import { RtmTokenBuilder } from 'agora-token';
import { agoraConfig, validateAgoraConfig } from '@/lib/agora/config';

/**
 * Generate RTM Token for Agora Chat/Messaging
 * POST /api/agora/rtm-token
 * 
 * Body: {
 *   userId: string (required)
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
    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
        { status: 400 }
      );
    }

    // Generate token expiration timestamp (current time + expiration time)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + agoraConfig.tokenExpirationTime;

    // Generate RTM token
    // Note: RTM tokens don't use roles - they're simpler than RTC tokens
    const token = RtmTokenBuilder.buildToken(
      agoraConfig.appId,
      agoraConfig.appCertificate,
      userId,
      expirationTimestamp
    );

    return NextResponse.json({
      success: true,
      data: {
        token,
        appId: agoraConfig.appId,
        userId,
        expirationTimestamp,
      },
    });
  } catch (error) {
    console.error('Error generating RTM token:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate RTM token',
      },
      { status: 500 }
    );
  }
}


