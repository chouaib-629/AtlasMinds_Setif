import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ArrowLeft, ArrowRight, Users, MessageCircle, Heart, Smile, ThumbsUp, Send, Gift, WifiOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AgoraRTC, { IAgoraRTCClient, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { livestreamService, Livestream } from '../lib/api/livestreams';

interface VirtualHallScreenProps {
  activityId: string;
  onBack: () => void;
}

export function VirtualHallScreen({ activityId, onBack }: VirtualHallScreenProps) {
  const { t, language } = useApp();
  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'أحمد', text: 'مرحباً بالجميع!', time: '14:30' },
    { id: '2', user: 'فاطمة', text: 'سعيدة بالانضمام', time: '14:31' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount, setViewerCount] = useState(145);
  const [showLiveDrop, setShowLiveDrop] = useState(false);
  const [networkIssue, setNetworkIssue] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [livestream, setLivestream] = useState<Livestream | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const remoteVideoTrackRef = useRef<IRemoteVideoTrack | null>(null);
  const remoteAudioTrackRef = useRef<IRemoteAudioTrack | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  // Fetch livestream data and initialize Agora
  useEffect(() => {
    let isMounted = true;
    
    const initializeStream = async () => {
      try {
        console.log('=== VirtualHallScreen: Starting initialization ===');
        console.log('Activity ID:', activityId);
        
        setIsLoading(true);
        setError(null);
        setDebugInfo('Fetching livestream data...');
        
        // Fetch livestream data
        console.log('Fetching livestream for ID:', activityId);
        const livestreamData = await livestreamService.getLivestream(parseInt(activityId));
        console.log('Livestream data received:', livestreamData);
        
        if (!isMounted) {
          console.log('Component unmounted, aborting');
          return;
        }
        
        setLivestream(livestreamData);
        
        console.log('Livestream check:', {
          has_agora: livestreamData.has_agora,
          channel_name: livestreamData.channel_name,
          is_live: livestreamData.is_live,
          title: livestreamData.title,
        });
        
        // Only initialize Agora if the livestream uses Agora
        if (livestreamData.has_agora && livestreamData.channel_name) {
          console.log('Livestream has Agora, initializing...');
          try {
            // Generate tokens for viewing
            const userId = `user_${Date.now()}`;
            const tokens = await livestreamService.getAgoraTokens({
              channelName: livestreamData.channel_name,
              userId: userId,
              role: 'audience',
              uid: 0,
            });
            
            if (!isMounted) return;
            
            console.log('Initializing Agora client...', {
              appId: tokens.appId,
              channelName: tokens.channelName,
              hasRtcToken: !!tokens.rtcToken,
            });
            setDebugInfo(`Joining channel: ${tokens.channelName}`);
            
            // Initialize Agora client with optimized settings for mobile
            const client = AgoraRTC.createClient({ 
              mode: 'live', 
              codec: 'vp8',
              // Force TURN relay for better mobile compatibility
              // This helps when P2P connections fail
            });
            
            // Set up client event logging for debugging
            client.on('exception', (event) => {
              console.error('Agora client exception:', event);
              setDebugInfo(`Agora error: ${event.msg || 'Unknown'}`);
            });
            
            clientRef.current = client;
            
            // Set client role to audience (viewer) - opposite of broadcaster
            await client.setClientRole('audience');
            console.log('Client role set to audience');
            
            // Function to handle playing remote video
            const playRemoteVideo = async (videoTrack: IRemoteVideoTrack, userId: string | number) => {
              try {
                if (!videoContainerRef.current) {
                  console.error('Video container ref is null!');
                  setDebugInfo('Error: Video container not found');
                  return;
                }
                
                console.log('Playing remote video for user:', userId);
                setDebugInfo(`Playing video from user ${userId}`);
                
                // Stop previous video track if exists
                if (remoteVideoTrackRef.current) {
                  try {
                    remoteVideoTrackRef.current.stop();
                    remoteVideoTrackRef.current.close();
                  } catch (e) {
                    console.warn('Error stopping previous video track:', e);
                  }
                }
                
                remoteVideoTrackRef.current = videoTrack;
                
                // Don't clear innerHTML - Agora SDK manages the video element
                // Just play the video track - SDK will create/update the video element
                // Wait a moment to ensure container is ready
                if (!videoContainerRef.current) {
                  throw new Error('Video container not available');
                }
                
                console.log('Playing video track in container:', {
                  containerExists: !!videoContainerRef.current,
                  containerId: videoContainerRef.current.id,
                });
                
                // Play the video track
                await videoTrack.play(videoContainerRef.current);
                
                // Give the browser a moment to set up the video element
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Monitor video element for frames
                const checkVideoFrames = () => {
                  const videoElement = videoContainerRef.current?.querySelector('video');
                  if (videoElement) {
                    const hasFrames = videoElement.videoWidth > 0 && videoElement.videoHeight > 0;
                    const readyStateNames = ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'];
                    
                    const srcObject = videoElement.srcObject as MediaStream | null;
                    const srcObjectTracks = srcObject?.getTracks() || [];
                    
                    console.log('Video element status:', {
                      videoWidth: videoElement.videoWidth,
                      videoHeight: videoElement.videoHeight,
                      readyState: videoElement.readyState,
                      readyStateName: readyStateNames[videoElement.readyState] || 'UNKNOWN',
                      hasFrames,
                      paused: videoElement.paused,
                      currentTime: videoElement.currentTime,
                      srcObject: !!srcObject,
                      srcObjectType: srcObject?.constructor?.name || 'none',
                      srcObjectTracks: srcObjectTracks.map(t => ({
                        kind: t.kind,
                        id: t.id,
                        label: t.label,
                        enabled: t.enabled,
                        muted: t.muted,
                        readyState: t.readyState,
                        active: t.readyState === 'live',
                      })),
                      networkState: videoElement.networkState,
                      networkStateNames: ['EMPTY', 'IDLE', 'LOADING', 'NO_SOURCE'],
                      networkStateName: videoElement.networkState < 4 ? ['EMPTY', 'IDLE', 'LOADING', 'NO_SOURCE'][videoElement.networkState] : 'UNKNOWN',
                      error: videoElement.error,
                    });
                    
                    // Check if MediaStreamTrack exists but isn't live
                    if (srcObjectTracks.length > 0) {
                      const videoTrack = srcObjectTracks.find(t => t.kind === 'video');
                      if (videoTrack) {
                        console.log('MediaStreamTrack in srcObject:', {
                          readyState: videoTrack.readyState,
                          enabled: videoTrack.enabled,
                          muted: videoTrack.muted,
                          active: videoTrack.readyState === 'live',
                        });
                        
                        if (videoTrack.readyState !== 'live') {
                          console.error(`❌ MediaStreamTrack is ${videoTrack.readyState}, not 'live'!`);
                          setDebugInfo(`Track state: ${videoTrack.readyState} (needs to be 'live')`);
                        }
                      }
                    }
                    
                    if (hasFrames) {
                      setDebugInfo(`✅ Video streaming: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
                      console.log('✅ Video frames received!');
                      setIsVideoPlaying(true);
                    } else {
                      const readyStateMsg = readyStateNames[videoElement.readyState] || `State ${videoElement.readyState}`;
                      setDebugInfo(`Waiting for frames... ${readyStateMsg}`);
                      console.warn(`⚠️ No frames yet. readyState: ${readyStateMsg} (${videoElement.readyState})`);
                      
                      // If stuck on HAVE_NOTHING for too long, show helpful message
                      if (videoElement.readyState === 0 && videoElement.currentTime === 0) {
                        console.error('❌ WebRTC connection issue: Video track exists but no frames received.');
                        console.error('');
                        console.error('ROOT CAUSE: WebRTC peer connection failed to establish');
                        console.error('');
                        console.error('SOLUTIONS:');
                        console.error('1. Use SEPARATE BROWSERS:');
                        console.error('   - Dashboard in Chrome: http://localhost:3000');
                        console.error('   - Mobile App in Firefox: http://localhost:3001');
                        console.error('');
                        console.error('2. Or use SEPARATE DEVICES on same network');
                        console.error('');
                        console.error('3. Check WebRTC ICE connection logs above for failures');
                        setDebugInfo('WebRTC connection failed. Use separate browsers.');
                      }
                      
                      // Check if there's an error
                      if (videoElement.error) {
                        console.error('Video element error:', videoElement.error);
                        setError(`Video error: ${videoElement.error.message || 'Unknown error'}`);
                      }
                      
                      // Continue checking if not ready
                      if (videoElement.readyState < 2) {
                        setTimeout(checkVideoFrames, 1000);
                      }
                    }
                  } else {
                    console.error('Video element NOT found in container!');
                    setDebugInfo('ERROR: Video element not found');
                  }
                };
                
                // Wait for video element to be created by Agora SDK
                let retries = 0;
                const findVideoElement = () => {
                  const videoElement = videoContainerRef.current?.querySelector('video');
                  if (videoElement) {
                    console.log('✅ Video element found in DOM');
                    
                    // Listen for video events
                    videoElement.addEventListener('loadedmetadata', () => {
                      console.log('✅ Video metadata loaded!');
                      checkVideoFrames();
                    });
                    videoElement.addEventListener('loadeddata', () => {
                      console.log('✅ Video data loaded!');
                      checkVideoFrames();
                    });
                    videoElement.addEventListener('canplay', () => {
                      console.log('✅ Video can play!');
                      checkVideoFrames();
                    });
                    videoElement.addEventListener('playing', () => {
                      console.log('✅ Video is playing!');
                      setIsVideoPlaying(true);
                      checkVideoFrames();
                    });
                    videoElement.addEventListener('waiting', () => {
                      console.warn('⏳ Video waiting for data...');
                    });
                    videoElement.addEventListener('stalled', () => {
                      console.warn('⚠️ Video stalled - no data arriving');
                    });
                    videoElement.addEventListener('error', (e) => {
                      console.error('❌ Video element error event:', e);
                      console.error('Error details:', videoElement.error);
                      setError('Video playback error occurred');
                    });
                    
                    // Check immediately
                    checkVideoFrames();
                    return true;
                  } else if (retries < 10) {
                    retries++;
                    setTimeout(findVideoElement, 200);
                    return false;
                  } else {
                    console.error('❌ Video element not found after waiting');
                    setError('Video element not created');
                    return false;
                  }
                };
                
                // Start looking for video element
                setTimeout(findVideoElement, 100);
                
                // Initial check after 500ms
                setTimeout(checkVideoFrames, 500);
                // Also check after 2 seconds
                setTimeout(checkVideoFrames, 2000);
                // And after 5 seconds
                setTimeout(checkVideoFrames, 5000);
                
                setIsVideoPlaying(true);
                setNetworkIssue(false);
                setError(null);
                console.log('Video playing successfully');
              } catch (playError) {
                console.error('Error playing video:', playError);
                setDebugInfo(`Error playing video: ${playError}`);
              }
            };
            
            // Function to handle playing remote audio
            const playRemoteAudio = async (audioTrack: IRemoteAudioTrack) => {
              try {
                console.log('Playing remote audio');
                remoteAudioTrackRef.current = audioTrack;
                await audioTrack.play();
              } catch (playError) {
                console.error('Error playing audio:', playError);
              }
            };
            
            // Set up event handlers
            client.on('user-published', async (user, mediaType) => {
              try {
                console.log('User published:', user.uid, mediaType);
                setDebugInfo(`User ${user.uid} published ${mediaType}`);
                
                // Subscribe to remote user's tracks
                await client.subscribe(user, mediaType);
                console.log('Subscribed to user:', user.uid, mediaType);
                
                if (mediaType === 'video') {
                  const remoteVideoTrack = user.videoTrack;
                  if (remoteVideoTrack) {
                    // Monitor video track state
                    console.log('Video track info:', {
                      trackId: remoteVideoTrack.getTrackId(),
                      isPlaying: remoteVideoTrack.isPlaying,
                      isMuted: remoteVideoTrack.isMuted,
                      enabled: remoteVideoTrack.enabled,
                      trackLabel: remoteVideoTrack.track?.label || 'no label',
                      trackReadyState: remoteVideoTrack.track?.readyState || 'unknown',
                      trackId2: remoteVideoTrack.track?.id || 'no id',
                      hasMediaStream: !!remoteVideoTrack.track,
                      mediaStreamTracks: remoteVideoTrack.track ? [remoteVideoTrack.track] : [],
                    });
                    
                    // Check if track has underlying MediaStreamTrack
                    if (remoteVideoTrack.track) {
                      const msTrack = remoteVideoTrack.track;
                      console.log('MediaStreamTrack details:', {
                        kind: msTrack.kind,
                        id: msTrack.id,
                        label: msTrack.label,
                        enabled: msTrack.enabled,
                        muted: msTrack.muted,
                        readyState: msTrack.readyState,
                      });
                    } else {
                      console.error('❌ Video track has NO underlying MediaStreamTrack!');
                      console.error('This means the WebRTC peer connection has not established.');
                      console.error('Possible causes:');
                      console.error('1. Both broadcaster and viewer on localhost in same browser');
                      console.error('2. WebRTC ICE connection failed (check logs above)');
                      console.error('3. Network/firewall blocking WebRTC');
                      console.error('');
                      console.error('SOLUTION: Try using SEPARATE BROWSERS or SEPARATE TABS');
                      console.error('  - Dashboard: http://localhost:3000 in Chrome');
                      console.error('  - Mobile App: http://localhost:3001 in Firefox (or vice versa)');
                      setDebugInfo('ERROR: WebRTC connection not established. Try separate browsers.');
                      
                      // Wait a bit and check again - sometimes the track appears after connection establishes
                      setTimeout(() => {
                        if (remoteVideoTrack.track) {
                          console.log('✅ MediaStreamTrack appeared after delay!');
                          setDebugInfo('MediaStreamTrack available now');
                        } else {
                          console.error('❌ MediaStreamTrack still missing after wait');
                        }
                      }, 3000);
                    }
                    
                    // Listen for video track events
                    remoteVideoTrack.on('first-frame-decoded', () => {
                      console.log('✅ FIRST FRAME DECODED! Video should be visible now.');
                      setDebugInfo('✅ Video frames received!');
                      setIsVideoPlaying(true);
                      setNetworkIssue(false);
                    });
                    
                    remoteVideoTrack.on('video-element-status-change', (status) => {
                      console.log('Video element status change:', status);
                      if (status === 'playing') {
                        setIsVideoPlaying(true);
                      }
                    });
                    
                    // Monitor track state changes
                    remoteVideoTrack.on('track-ended', () => {
                      console.warn('Video track ended');
                      setDebugInfo('Video track ended');
                      setIsVideoPlaying(false);
                    });
                    
                    console.log('✅ Video track event listeners registered. Waiting for frames...');
                    
                    await playRemoteVideo(remoteVideoTrack, user.uid);
                  } else {
                    console.warn('No video track found for user:', user.uid);
                    setDebugInfo('ERROR: No video track from broadcaster');
                  }
                }
                if (mediaType === 'audio') {
                  const remoteAudioTrack = user.audioTrack;
                  if (remoteAudioTrack) {
                    await playRemoteAudio(remoteAudioTrack);
                  }
                }
              } catch (error) {
                console.error('Error subscribing to user track:', error);
                setDebugInfo(`Error: ${error}`);
              }
            });
            
            client.on('user-unpublished', (user, mediaType) => {
              console.log('User unpublished:', user.uid, mediaType);
              setDebugInfo(`User ${user.uid} unpublished ${mediaType}`);
              
              if (mediaType === 'video' && remoteVideoTrackRef.current) {
                remoteVideoTrackRef.current.stop();
                remoteVideoTrackRef.current.close();
                remoteVideoTrackRef.current = null;
                setIsVideoPlaying(false);
              }
              if (mediaType === 'audio' && remoteAudioTrackRef.current) {
                remoteAudioTrackRef.current.stop();
                remoteAudioTrackRef.current.close();
                remoteAudioTrackRef.current = null;
              }
            });
            
            client.on('user-joined', (user) => {
              console.log('User joined channel:', user.uid);
              setDebugInfo(`User ${user.uid} joined`);
            });
            
            client.on('connection-state-change', (curState, revState) => {
              console.log('Connection state changed:', curState, revState);
              setDebugInfo(`Connection: ${curState}`);
              
              if (curState === 'DISCONNECTED' || curState === 'FAILED') {
                setNetworkIssue(true);
                setError(t('فقدان الاتصال بالبث', 'Connection lost'));
                setIsVideoPlaying(false);
              } else if (curState === 'CONNECTED') {
                setNetworkIssue(false);
                setDebugInfo('Connected - waiting for broadcaster...');
              }
            });
            
            // Join channel (same as dashboard, but with audience role)
            // Use null for uid (same as dashboard broadcaster does)
            console.log('Joining channel...');
            await client.join(tokens.appId, tokens.channelName, tokens.rtcToken, null);
            console.log('Joined channel successfully');
            setDebugInfo('Joined channel - waiting for stream...');
            
            if (!isMounted) return;
            
            setIsLoading(false);
            
            // Check for existing remote users (in case broadcaster joined before viewer)
            const remoteUsers = client.remoteUsers;
            console.log('Remote users in channel:', remoteUsers.length);
            
            if (remoteUsers.length > 0) {
              console.log('Found existing users, subscribing...');
              for (const user of remoteUsers) {
                if (user.hasVideo && user.videoTrack && videoContainerRef.current) {
                  await playRemoteVideo(user.videoTrack, user.uid);
                }
                if (user.hasAudio && user.audioTrack) {
                  await playRemoteAudio(user.audioTrack);
                }
              }
            } else {
              console.log('No remote users yet - waiting for broadcaster to join...');
              setDebugInfo('Waiting for broadcaster to start streaming...');
            }
            
            // Simulate viewer count update
            setViewerCount(prev => prev + Math.floor(Math.random() * 10));
          } catch (agoraError) {
            console.error('Agora initialization error:', agoraError);
            if (isMounted) {
              const errorMessage = agoraError instanceof Error ? agoraError.message : String(agoraError);
              setError(t('فشل الاتصال بالبث المباشر', 'Failed to connect to livestream'));
              setDebugInfo(`Error: ${errorMessage}`);
              setIsLoading(false);
              setNetworkIssue(true);
            }
          }
        } else {
          console.log('Livestream does not have Agora setup:', {
            has_agora: livestreamData.has_agora,
            channel_name: livestreamData.channel_name,
            stream_url: livestreamData.stream_url,
          });
          
          if (livestreamData.stream_url) {
            // If it's a regular stream URL (not Agora), handle differently
            // For now, just show placeholder
            console.log('Has stream_url but not Agora');
            setDebugInfo('Regular stream URL (not Agora)');
            setIsLoading(false);
          } else {
            console.warn('No Agora channel or stream URL available');
            setDebugInfo('No Agora channel configured');
            setIsLoading(false);
            setError(t('لا يوجد بث مباشر متاح', 'No livestream available'));
          }
        }
      } catch (err) {
        console.error('=== Failed to load livestream ===');
        console.error('Error:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
        
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : t('فشل تحميل البث المباشر', 'Failed to load livestream');
          setError(errorMessage);
          setDebugInfo(`Error: ${errorMessage}`);
          setIsLoading(false);
        }
      }
    };
    
    initializeStream();
    
    return () => {
      console.log('=== VirtualHallScreen: Cleanup ===');
      isMounted = false;
      
      // Cleanup video track first
      if (remoteVideoTrackRef.current) {
        try {
          remoteVideoTrackRef.current.stop();
          remoteVideoTrackRef.current.close();
          remoteVideoTrackRef.current = null;
        } catch (e) {
          console.warn('Error cleaning up video track:', e);
        }
      }
      
      // Cleanup audio track
      if (remoteAudioTrackRef.current) {
        try {
          remoteAudioTrackRef.current.stop();
          remoteAudioTrackRef.current.close();
          remoteAudioTrackRef.current = null;
        } catch (e) {
          console.warn('Error cleaning up audio track:', e);
        }
      }
      
      // Cleanup Agora client last
      if (clientRef.current) {
        clientRef.current.leave().catch((err) => {
          console.warn('Error leaving channel during cleanup:', err);
        });
        clientRef.current = null;
      }
      
      // Clear video container (Agora SDK should handle this, but just in case)
      if (videoContainerRef.current) {
        // Don't manipulate DOM directly - Agora SDK manages video elements
        // The track.stop() and track.close() should handle cleanup
      }
    };
  }, [activityId, t]);

  // Style video elements that Agora SDK injects
  useEffect(() => {
    if (!videoContainerRef.current) return;

    const styleVideoElements = () => {
      const videos = videoContainerRef.current?.querySelectorAll('video');
      console.log(`Found ${videos?.length || 0} video element(s) in container`);
      
      videos?.forEach((video, index) => {
        console.log(`Styling video element ${index}:`, {
          currentWidth: video.style.width,
          currentHeight: video.style.height,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        });
        
        // Force styling to ensure visibility
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        video.style.objectFit = 'contain';
        video.style.backgroundColor = 'black';
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.opacity = '1';
        video.style.position = 'relative';
        video.style.zIndex = '1';
        
        // Make sure video plays
        if (video.paused) {
          video.play().catch(err => console.warn('Video play error:', err));
        }
      });
    };

    // Style existing videos
    styleVideoElements();

    // Watch for new video elements (MutationObserver)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          console.log('New nodes added to video container');
          styleVideoElements();
        }
      });
    });

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Also check periodically
    const interval = setInterval(() => {
      styleVideoElements();
    }, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [isVideoPlaying]);

  useEffect(() => {
    // Simulate live drop after 5 seconds
    const timer = setTimeout(() => {
      setShowLiveDrop(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, {
      id: Date.now().toString(),
      user: t('أنت', 'You'),
      text: newMessage,
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
  };

  const handleReaction = (reaction: string) => {
    toast.success(reaction);
  };

  const handleClaimDrop = () => {
    setShowLiveDrop(false);
    toast.success(t('تم استلام المكافأة: +50 نقطة', 'Reward claimed: +50 points'));
  };

  const livestreamTitle = livestream?.title || t('ندوة القيادة الشبابية', 'Youth Leadership Seminar');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20">
            <BackIcon className="w-6 h-6" />
          </button>
          <Badge className="bg-red-500 text-white flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {t('مباشر', 'LIVE')}
          </Badge>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{viewerCount}</span>
          </div>
        </div>
        <h3>{livestreamTitle}</h3>
      </div>

      {/* Video/Live Area */}
      <div 
        className="relative flex-1 bg-black"
        style={{ minHeight: '300px', position: 'relative', overflow: 'hidden' }}
      >
        {/* Video container - Agora SDK will inject video element here */}
        <div 
          ref={videoContainerRef}
          id="agora-video-container"
          className="absolute inset-0 w-full h-full"
          style={{ 
            zIndex: isVideoPlaying ? 10 : 0,
            backgroundColor: 'black',
            minWidth: '100%',
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        
        {/* Overlay content (only visible when not playing video) */}
        {isLoading && !isVideoPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
            <div className="text-center text-white space-y-4">
              <Loader2 className="w-16 h-16 mx-auto animate-spin" />
              <p className="text-xl">{t('جاري الاتصال بالبث...', 'Connecting to stream...')}</p>
            </div>
          </div>
        )}
        
        {error && !isLoading && !isVideoPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
            <div className="text-center text-white space-y-4 p-4">
              <WifiOff className="w-16 h-16 mx-auto" />
              <p className="text-xl">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="bg-white/20 text-white border-white/30">
                {t('إعادة المحاولة', 'Retry')}
              </Button>
            </div>
          </div>
        )}
        
        {!isLoading && !error && livestream?.has_agora && !isVideoPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-purple-900 to-blue-900">
            {/* Placeholder while waiting for broadcaster */}
            <div className="text-center text-white space-y-4 p-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-16 h-16" />
              </div>
              <p className="text-xl">{t('البث المباشر جاري', 'Live Stream in Progress')}</p>
              {debugInfo && (
                <div className="space-y-2">
                  <p className="text-sm opacity-75 mt-2">{debugInfo}</p>
                  {debugInfo.includes('Waiting for video frames') && (
                    <p className="text-xs opacity-60 mt-2 max-w-md mx-auto">
                      {t('جارٍ الاتصال بالبث المباشر. تأكد من أن المذيع قد بدأ البث.', 'Connecting to stream. Please ensure the broadcaster has started streaming.')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {!isLoading && !error && !livestream?.has_agora && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-purple-900 to-blue-900">
            {/* Placeholder for non-Agora streams */}
            <div className="text-center text-white space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-16 h-16" />
              </div>
              <p className="text-xl">{t('البث المباشر جاري', 'Live Stream in Progress')}</p>
            </div>
          </div>
        )}

        {/* Network Issue Banner */}
        {networkIssue && (
          <div className="absolute top-4 left-4 right-4 bg-warning/90 text-warning-foreground px-4 py-2 rounded-lg flex items-center gap-2 z-10">
            <WifiOff className="w-5 h-5" />
            <p>{t('ضعف الاتصال بالإنترنت', 'Weak network connection')}</p>
          </div>
        )}

        {/* Reaction Buttons */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
          {[
            { icon: Heart, color: 'text-red-500' },
            { icon: ThumbsUp, color: 'text-blue-500' },
            { icon: Smile, color: 'text-yellow-500' },
          ].map((reaction, i) => {
            const Icon = reaction.icon;
            return (
              <button
                key={i}
                onClick={() => handleReaction(reaction.icon.name)}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <Icon className={`w-6 h-6 ${reaction.color}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="h-64 bg-card border-t border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h4>{t('الدردشة المباشرة', 'Live Chat')}</h4>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs">{msg.user[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('اكتب رسالة...', 'Type a message...')}
            />
            <Button type="submit" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Live Drop Modal */}
      <Dialog open={showLiveDrop} onOpenChange={setShowLiveDrop}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t('🎁 مكافأة مباشرة!', '🎁 Live Drop!')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white text-center space-y-3">
              <Gift className="w-16 h-16 mx-auto" />
              <h2>+50</h2>
              <p>{t('نقطة مكافأة', 'Bonus Points')}</p>
            </div>

            <p className="text-center text-muted-foreground">
              {t('شكراً لمشاركتك في البث المباشر!', 'Thanks for joining the live stream!')}
            </p>

            <Button onClick={handleClaimDrop} className="w-full" size="lg">
              {t('استلام المكافأة', 'Claim Reward')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
