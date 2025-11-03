<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AgoraTokenController extends Controller
{
    /**
     * Generate Agora RTC and RTM tokens for mobile app viewers
     * This is a simplified implementation - for production, use a proper Agora token library
     * 
     * For now, we'll create an endpoint that returns the necessary info
     * The actual token generation should be done server-side using Agora's token builder
     * 
     * TODO: Implement proper Agora token generation using a PHP library or API call
     */
    public function generateTokens(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'channel_name' => 'required|string',
            'user_id' => 'required|string',
            'role' => 'nullable|in:broadcaster,audience',
            'uid' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $channelName = $request->channel_name;
        $userId = $request->user_id;
        $role = $request->input('role', 'audience');
        $uid = $request->input('uid', 0);

        // Get Agora credentials from environment
        $appId = env('AGORA_APP_ID');
        $appCertificate = env('AGORA_APP_CERTIFICATE');

        if (!$appId || !$appCertificate) {
            return response()->json([
                'success' => false,
                'message' => 'Agora configuration is missing. Please set AGORA_APP_ID and AGORA_APP_CERTIFICATE in .env',
            ], 500);
        }

        // Token expiration (24 hours)
        $expirationTime = 3600 * 24;
        $currentTimestamp = time();
        $expirationTimestamp = $currentTimestamp + $expirationTime;

        // Note: For production, use a proper Agora token generation library
        // This is a placeholder - you should implement token generation using:
        // 1. Agora Token Server SDK for PHP (if available)
        // 2. Or make an internal API call to the dashboard's token endpoint
        // 3. Or use a third-party library that implements Agora token generation
        
        // For now, return the credentials needed for the mobile app
        // The mobile app should generate tokens client-side OR call the dashboard API
        return response()->json([
            'success' => true,
            'message' => 'Use dashboard API endpoint /api/agora/tokens for token generation, or implement proper token builder',
            'data' => [
                'appId' => $appId,
                'channelName' => $channelName,
                'userId' => $userId,
                'uid' => $uid,
                'role' => $role,
                'expirationTimestamp' => $expirationTimestamp,
                'note' => 'For now, call the dashboard API at /api/agora/tokens or implement token generation on server',
            ],
        ]);
    }

    /**
     * Get Agora configuration (app ID only, for security)
     */
    public function getConfig()
    {
        $appId = env('AGORA_APP_ID');

        if (!$appId) {
            return response()->json([
                'success' => false,
                'message' => 'Agora configuration is missing',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'appId' => $appId,
            ],
        ]);
    }
}

