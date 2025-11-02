'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Livestream } from '@/lib/api';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Settings } from 'lucide-react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

export default function StreamHostPage() {
  const router = useRouter();
  const params = useParams();
  const { admin } = useAuth();
  const livestreamId = params.id as string;

  const [livestream, setLivestream] = useState<Livestream | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLivestream();
    return () => {
      // Cleanup on unmount
      stopStreaming();
    };
  }, [livestreamId]);

  const loadLivestream = async () => {
    try {
      const response = await apiService.getLivestreams();
      if (response.success && response.data) {
        const found = response.data.livestreams.find(
          (ls: Livestream) => ls.id.toString() === livestreamId
        );
        if (found) {
          setLivestream(found);
        } else {
          setError('Livestream not found');
        }
      }
    } catch (error) {
      console.error('Error loading livestream:', error);
      setError('Failed to load livestream');
    } finally {
      setLoading(false);
    }
  };

  const startStreaming = async () => {
    if (!livestream?.channel_name || !admin) {
      setError('Missing livestream channel or admin info');
      return;
    }

    try {
      setError(null);

      // Get tokens from API
      const userId = admin.id.toString();
      const tokenResponse = await apiService.getAgoraTokens({
        channelName: livestream.channel_name,
        userId,
        role: 'broadcaster',
        uid: 0,
      });

      if (!tokenResponse.success || !tokenResponse.data) {
        throw new Error(tokenResponse.message || 'Failed to get Agora tokens');
      }

      const { rtcToken, appId, channelName } = tokenResponse.data;

      // Initialize Agora client
      const client = AgoraRTC.createClient({
        mode: 'live',
        codec: 'vp8',
      });

      clientRef.current = client;

      // Set client role to host (for web SDK, use 'host' not 'broadcaster')
      await client.setClientRole('host');

      // Enable local video and audio
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      localVideoTrackRef.current = localVideoTrack;
      localAudioTrackRef.current = localAudioTrack;

      // Play local video
      if (videoContainerRef.current) {
        localVideoTrack.play(videoContainerRef.current);
      }

      // Join channel
      await client.join(appId, channelName, rtcToken, null);

      // Publish local tracks
      await client.publish([localVideoTrack, localAudioTrack]);

      setIsStreaming(true);
      setIsVideoEnabled(true);
      setIsMuted(false);

      // Update livestream status to live
      await apiService.updateLivestream(livestream.id, { is_live: true });
    } catch (error: any) {
      console.error('Error starting stream:', error);
      setError(error?.message || 'Failed to start streaming');
      stopStreaming();
    }
  };

  const stopStreaming = async () => {
    try {
      // Stop and unpublish tracks
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }

      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }

      // Leave channel
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }

      // Clear video container
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = '';
      }

      setIsStreaming(false);

      // Update livestream status to offline
      if (livestream) {
        await apiService.updateLivestream(livestream.id, { is_live: false });
      }
    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  };

  const toggleMute = async () => {
    if (localAudioTrackRef.current) {
      if (isMuted) {
        await localAudioTrackRef.current.setMuted(false);
        setIsMuted(false);
      } else {
        await localAudioTrackRef.current.setMuted(true);
        setIsMuted(true);
      }
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      if (isVideoEnabled) {
        await localVideoTrackRef.current.setEnabled(false);
        setIsVideoEnabled(false);
      } else {
        await localVideoTrackRef.current.setEnabled(true);
        setIsVideoEnabled(true);
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error && !livestream) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => router.push('/dashboard/livestreams')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Back to Livestreams
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-black">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{livestream?.title || 'Streaming'}</h1>
              <p className="text-sm text-gray-400">Channel: {livestream?.channel_name}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/livestreams')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Back
            </button>
          </div>

          {/* Video Container */}
          <div className="relative w-full" style={{ height: 'calc(100vh - 200px)' }}>
            <div
              ref={videoContainerRef}
              className="w-full h-full bg-gray-900 flex items-center justify-center"
            >
              {!isStreaming && (
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Ready to go live</p>
                  <p className="text-sm text-gray-400 mt-2">Click Start Streaming to begin</p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Streaming Status */}
            {isStreaming && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIVE</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-900 p-4 flex items-center justify-center gap-4">
            {!isStreaming ? (
              <button
                onClick={startStreaming}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2"
              >
                <Video className="h-5 w-5" />
                Start Streaming
              </button>
            ) : (
              <>
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoEnabled
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  title={isVideoEnabled ? 'Disable Video' : 'Enable Video'}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>

                <button
                  onClick={toggleMute}
                  className={`p-3 rounded-full ${
                    isMuted
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                <button
                  onClick={stopStreaming}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  <PhoneOff className="h-5 w-5" />
                  End Stream
                </button>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

