// Agora Configuration
// These values should be set in your .env.local file

export const agoraConfig = {
  appId: process.env.AGORA_APP_ID || '',
  appCertificate: process.env.AGORA_APP_CERTIFICATE || '',
  // Token expiration time in seconds (24 hours default)
  tokenExpirationTime: 86400,
};

// Validate Agora configuration
export function validateAgoraConfig(): { valid: boolean; message?: string } {
  if (!agoraConfig.appId) {
    return { valid: false, message: 'AGORA_APP_ID is not set' };
  }
  if (!agoraConfig.appCertificate) {
    return { valid: false, message: 'AGORA_APP_CERTIFICATE is not set' };
  }
  return { valid: true };
}

// Generate a unique channel name from livestream ID
export function generateChannelName(livestreamId: number): string {
  return `livestream-${livestreamId}`;
}

// Parse channel name to get livestream ID
export function parseChannelName(channelName: string): number | null {
  const match = channelName.match(/^livestream-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}


