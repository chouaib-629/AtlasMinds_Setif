import React, { useState, useEffect } from 'react';
import { AppProvider } from './lib/context';
import { AuthProvider, useAuth } from './lib/authContext';
import { MobileContainer } from './components/MobileContainer';
import { BottomNav } from './components/BottomNav';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { InterestsSelectionScreen } from './screens/InterestsSelectionScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { CenterDetailScreen } from './screens/CenterDetailScreen';
import { MapScreen } from './screens/MapScreen';
import { ActivityDetailScreen } from './screens/ActivityDetailScreen';
import { QuestScreen } from './screens/QuestScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SuggestionsScreen } from './screens/SuggestionsScreen';
import { VirtualHallScreen } from './screens/VirtualHallScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { AdminLocalScreen } from './screens/AdminLocalScreen';
import { LivePlayerScreen, MiniLivePlayer } from './screens/LivePlayerScreen';
import { ChatsScreen } from './screens/ChatsScreen';
import { ChatRoomScreen } from './screens/ChatRoomScreen';
import { CreateClubScreen } from './screens/CreateClubScreen';
import { AppointmentBookingScreen, AppointmentConfirmationScreen } from './screens/AppointmentBookingScreen';
import { CentralAdminScreen } from './screens/CentralAdminScreen';
import { QRTicket } from './components/QRTicket';
import { InterestsModal } from './components/InterestsModal';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

type AppState =
  | { screen: 'onboarding' }
  | { screen: 'auth' }
  | { screen: 'interests-selection' }
  | { screen: 'main'; activeTab: string }
  | { screen: 'activity-detail'; activityId: string }
  | { screen: 'virtual-hall'; activityId: string }
  | { screen: 'qr-ticket'; qrData: any }
  | { screen: 'notifications' }
  | { screen: 'suggestions' }
  | { screen: 'admin-local' }
  | { screen: 'admin-central' }
  | { screen: 'live-player'; sessionId: string }
  | { screen: 'chats' }
  | { screen: 'chat-room'; channelId: string }
  | { screen: 'create-club' }
  | { screen: 'center-detail'; centerId: string }
  | { screen: 'appointment-booking'; centerId: string; centerName: string }
  | { screen: 'appointment-confirmation'; appointmentId: string };

function AppContent() {
  const { isAuthenticated, user, isLoading, refreshUser } = useAuth();
  const [appState, setAppState] = useState<AppState>({ screen: 'onboarding' });
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);
  const [currentLiveSessionId, setCurrentLiveSessionId] = useState<string | null>(null);
  const [showInterestsAfterDelay, setShowInterestsAfterDelay] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Redirect to auth if not authenticated (after onboarding)
  useEffect(() => {
    if (appState.screen !== 'onboarding' && appState.screen !== 'auth' && appState.screen !== 'interests-selection' && !isAuthenticated) {
      setAppState({ screen: 'auth' });
    }
  }, [isAuthenticated, appState.screen]);

  // Refresh user data after authentication to ensure we have latest preferences
  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      refreshUser();
    }
  }, [isAuthenticated, user, isLoading, refreshUser]);

  // Check preferences and show interests screen after login if missing (10 seconds delay)
  useEffect(() => {
    // Only trigger for users on main screen who don't have preferences
    // Skip if user just completed interests selection (isNewUser flag)
    if (isAuthenticated && user && appState.screen === 'main' && !isLoading && !isNewUser) {
      const hasPreferences = user.preferences && Array.isArray(user.preferences) && user.preferences.length > 0;
      
      if (!hasPreferences && !showInterestsAfterDelay) {
        // Show interests modal after 10 seconds if no preferences
        const timer = setTimeout(() => {
          // Use functional update to check current state
          setAppState((currentState) => {
            // Only show if still on main screen
            if (currentState.screen === 'main') {
              setShowInterestsAfterDelay(true);
            }
            return currentState;
          });
        }, 10000); // 10 seconds after reaching main screen

        return () => clearTimeout(timer);
      } else if (hasPreferences) {
        // User has preferences, cancel any pending timer
        setShowInterestsAfterDelay(false);
      }
    }
    // Also check when user changes (e.g., after saving preferences)
    if (isAuthenticated && user && user.preferences && Array.isArray(user.preferences) && user.preferences.length > 0) {
      setShowInterestsAfterDelay(false);
    }
  }, [isAuthenticated, user, appState.screen, isLoading, showInterestsAfterDelay, isNewUser]);

  const handleOnboardingComplete = () => {
    setAppState({ screen: 'auth' });
  };

  const handleAuthComplete = () => {
    // After login/registration, always go to main screen first
    // The useEffect will handle showing interests after 15 seconds if no preferences
    // For new registrations, we might want to show immediately - but following the requirement
    // which says "after 15s from login", we'll use the same flow
    setIsNewUser(false); // Reset flag
    setAppState({ screen: 'main', activeTab: 'home' });
  };

  const handleInterestsComplete = () => {
    setShowInterestsAfterDelay(false);
    setIsNewUser(false);
    setAppState({ screen: 'main', activeTab: 'home' });
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'admin') {
      setAppState({ screen: 'admin-local' });
    } else {
      setAppState({ screen: 'main', activeTab: tab });
    }
  };

  const handleActivityClick = (activityId: string) => {
    setAppState({ screen: 'activity-detail', activityId });
  };

  const handleCenterClick = (centerId: string) => {
    setAppState({ screen: 'center-detail', centerId });
  };

  const handleOpenQuests = () => {
    setAppState({ screen: 'main', activeTab: 'quests' });
  };

  const handleOpenChats = () => {
    setAppState({ screen: 'chats' });
  };

  const handleBackToMain = (tab: string = 'home') => {
    setAppState({ screen: 'main', activeTab: tab });
  };

  const handleBookingComplete = (qrCode: string, activityData?: any) => {
    // Get user info dynamically
    const userName = user?.name || (user?.nom && user?.prenom ? `${user.nom} ${user.prenom}` : user?.email || 'User');
    
    setAppState({
      screen: 'qr-ticket',
      qrData: {
        qrCode,
        activityTitle: activityData?.title || 'ورشة البرمجة للمبتدئين',
        activityDate: activityData?.date || new Date().toISOString().split('T')[0],
        activityTime: activityData?.time || '14:00',
        centerName: activityData?.center_name || 'دار الشباب المركزي',
        userName: userName,
      },
    });
  };

  const handleOpenVirtualHall = (activityId: string) => {
    setAppState({ screen: 'virtual-hall', activityId });
  };

  const handleOpenSuggestions = () => {
    setAppState({ screen: 'suggestions' });
  };

  const handleOpenNotifications = () => {
    setAppState({ screen: 'notifications' });
  };

  const handleOpenMap = () => {
    setAppState({ screen: 'main', activeTab: 'map' });
  };

  const handleLiveSessionClick = (sessionId: string) => {
    setCurrentLiveSessionId(sessionId);
    setAppState({ screen: 'live-player', sessionId });
    setMiniPlayerVisible(false);
  };

  const handleMinimizeLivePlayer = () => {
    setMiniPlayerVisible(true);
    setAppState({ screen: 'main', activeTab: 'home' });
  };

  const handleExpandMiniPlayer = () => {
    if (currentLiveSessionId) {
      setAppState({ screen: 'live-player', sessionId: currentLiveSessionId });
      setMiniPlayerVisible(false);
    }
  };

  const handleCloseMiniPlayer = () => {
    setMiniPlayerVisible(false);
    setCurrentLiveSessionId(null);
  };

  const handleChannelClick = (channelId: string) => {
    setAppState({ screen: 'chat-room', channelId });
  };

  const handleCreateChannel = () => {
    setAppState({ screen: 'create-club' });
  };

  const handleClubCreated = (clubId: string) => {
    setAppState({ screen: 'chat-room', channelId: clubId });
  };

  const handleBookAppointment = (centerId: string, centerName: string) => {
    setAppState({ screen: 'appointment-booking', centerId, centerName });
  };

  const handleAppointmentComplete = (appointmentId: string) => {
    setAppState({ screen: 'appointment-confirmation', appointmentId });
  };

  const handleOpenCentralAdmin = () => {
    setAppState({ screen: 'admin-central' });
  };

  return (
    <>
      <MobileContainer>
        {appState.screen === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {appState.screen === 'auth' && (
          <AuthScreen onComplete={handleAuthComplete} />
        )}

        {/* Show interests as full screen during onboarding flow */}
        {appState.screen === 'interests-selection' && !showInterestsAfterDelay && (
          <InterestsSelectionScreen onComplete={handleInterestsComplete} />
        )}

        {appState.screen === 'main' && (
          <>
            {appState.activeTab === 'home' && (
              <HomeScreen
                onActivityClick={handleActivityClick}
                onNotificationsClick={handleOpenNotifications}
                onMapClick={handleOpenMap}
                onCenterClick={handleCenterClick}
                onLivestreamClick={(livestreamId) => {
                  setAppState({ screen: 'virtual-hall', activityId: livestreamId });
                }}
              />
            )}
            {appState.activeTab === 'insights' && (
              <InsightsScreen
                onCenterClick={handleCenterClick}
                onActivityClick={handleActivityClick}
                onQuestsClick={handleOpenQuests}
                onChatsClick={handleOpenChats}
              />
            )}
            {appState.activeTab === 'leaderboard' && (
              <LeaderboardScreen />
            )}
            {appState.activeTab === 'map' && (
              <MapScreen onCenterClick={handleCenterClick} />
            )}
            {appState.activeTab === 'quests' && <QuestScreen />}
            {appState.activeTab === 'rewards' && <RewardsScreen />}
            {appState.activeTab === 'profile' && <ProfileScreen />}
            <BottomNav activeTab={appState.activeTab} onTabChange={handleTabChange} />
          </>
        )}

        {appState.screen === 'activity-detail' && (
          <ActivityDetailScreen
            activityId={appState.activityId}
            onBack={() => handleBackToMain('home')}
            onBookingComplete={handleBookingComplete}
            onCenterClick={handleCenterClick}
          />
        )}

        {appState.screen === 'virtual-hall' && (
          <VirtualHallScreen
            activityId={appState.activityId}
            onBack={() => handleBackToMain('home')}
          />
        )}

        {appState.screen === 'qr-ticket' && (
          <QRTicket
            {...appState.qrData}
            onBack={() => handleBackToMain('home')}
          />
        )}

        {appState.screen === 'notifications' && (
          <NotificationsScreen onBack={() => handleBackToMain('home')} />
        )}

        {appState.screen === 'suggestions' && (
          <SuggestionsScreen onBack={() => handleBackToMain('home')} />
        )}

        {appState.screen === 'admin-local' && <AdminLocalScreen />}

        {appState.screen === 'admin-central' && (
          <CentralAdminScreen onBack={() => handleBackToMain('home')} />
        )}

        {appState.screen === 'live-player' && (
          <LivePlayerScreen
            sessionId={appState.sessionId}
            onBack={() => handleBackToMain('home')}
            onMinimize={handleMinimizeLivePlayer}
          />
        )}

        {appState.screen === 'chats' && (
          <ChatsScreen
            onBack={() => handleBackToMain('insights')}
            onChannelClick={handleChannelClick}
            onCreateChannel={handleCreateChannel}
          />
        )}

        {appState.screen === 'chat-room' && (
          <ChatRoomScreen
            channelId={appState.channelId}
            onBack={() => handleOpenChats()}
            onShowMembers={() => {}}
          />
        )}

        {appState.screen === 'create-club' && (
          <CreateClubScreen
            onBack={() => handleOpenChats()}
            onComplete={handleClubCreated}
          />
        )}

        {appState.screen === 'center-detail' && (
          <CenterDetailScreen
            centerId={appState.centerId}
            onBack={() => handleBackToMain('insights')}
            onActivityClick={handleActivityClick}
            onBookAppointment={handleBookAppointment}
          />
        )}

        {appState.screen === 'appointment-booking' && (
          <AppointmentBookingScreen
            centerId={appState.centerId}
            centerName={appState.centerName}
            onBack={() => handleBackToMain('home')}
            onComplete={handleAppointmentComplete}
          />
        )}

        {appState.screen === 'appointment-confirmation' && (
          <AppointmentConfirmationScreen
            appointmentId={appState.appointmentId}
            onBack={() => handleBackToMain('home')}
          />
        )}

        {/* Mini Live Player Overlay */}
        {miniPlayerVisible && currentLiveSessionId && (
          <MiniLivePlayer
            onExpand={handleExpandMiniPlayer}
            onClose={handleCloseMiniPlayer}
          />
        )}

        {/* Interests Modal - Shows as animated popup after 10 seconds if no preferences */}
        {showInterestsAfterDelay && appState.screen === 'main' && (
          <InterestsModal
            open={showInterestsAfterDelay}
            onClose={() => {
              setShowInterestsAfterDelay(false);
            }}
            onComplete={handleInterestsComplete}
          />
        )}
      </MobileContainer>
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}
