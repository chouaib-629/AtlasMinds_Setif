import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import WaveSeparator from '../components/WaveSeparator';
import {
  ClipboardIcon,
  HandshakeIcon,
  LightbulbIcon,
  ThumbsUpIcon,
  CreditCardIcon,
  SettingsIcon,
  HelpIcon,
  InfoIcon,
  CalendarIcon,
  ClockIcon,
} from '../components/Icons';

const ProfileScreen = ({ navigation }) => {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const languageButtonRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      // On web, use confirm dialog
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        try {
          await logout();
        } catch (error) {
          alert('An error occurred during logout. Please try again.');
        }
      }
    } else {
      // On native platforms, use Alert
      Alert.alert(
        t('logout'),
        'Are you sure you want to logout?',
        [
          { 
            text: t('cancel'), 
            style: 'cancel',
          },
          {
            text: t('logout'),
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
              } catch (error) {
                Alert.alert(t('error'), 'An error occurred during logout. Please try again.');
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const getLanguageDisplay = () => {
    const langMap = {
      en: 'EN',
      fr: 'FR',
      ar: 'AR',
    };
    return langMap[language] || 'EN';
  };

  const menuItems = [
    {
      id: 1,
      title: t('myActivities'),
      icon: ClipboardIcon,
      onPress: () => {
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Events');
        } else {
          navigation.navigate('Events');
        }
      },
    },
    {
      id: 2,
      title: t('volunteerHistory'),
      icon: HandshakeIcon,
      onPress: () => {},
    },
    {
      id: 3,
      title: t('myProjects'),
      icon: LightbulbIcon,
      onPress: () => {},
    },
    {
      id: 4,
      title: t('suggestedProjects'),
      icon: ThumbsUpIcon,
      onPress: () => {},
    },
    {
      id: 5,
      title: t('paymentHistory'),
      icon: CreditCardIcon,
      onPress: () => {},
    },
    {
      id: 6,
      title: t('settings'),
      icon: SettingsIcon,
      onPress: () => {},
    },
    {
      id: 7,
      title: t('help'),
      icon: HelpIcon,
      onPress: () => {},
    },
    {
      id: 8,
      title: t('about'),
      icon: InfoIcon,
      onPress: () => {},
    },
  ];

  const stats = [
    { label: t('activitiesJoined'), value: '12', icon: CalendarIcon },
    { label: t('hoursVolunteered'), value: '48', icon: ClockIcon },
    { label: t('projectsSuggested'), value: '3', icon: LightbulbIcon },
    { label: t('projectsUpvoted'), value: '15', icon: ThumbsUpIcon },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with coral background */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          ref={languageButtonRef}
          style={styles.languageButton}
          onPress={() => {
            languageButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
              setButtonPosition({ x: pageX, y: pageY, width, height });
              setLanguageModalVisible(true);
            });
          }}
        >
          <Text style={styles.languageButtonText}>
            {language === 'en' ? 'EN' : language === 'fr' ? 'FR' : 'AR'}
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.waveContainer,
            {
              opacity: waveAnim,
              transform: [
                {
                  translateY: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <WaveSeparator color="#FFFFFF" />
        </Animated.View>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>{t('myProfile')}</Text>
        </Animated.View>
      </View>

      {/* White content section */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          pointerEvents="box-none"
        >
          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
            {user?.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                // Navigate to edit profile
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>{t('editProfile')}</Text>
            </TouchableOpacity>
          </View>

          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('statistics')}</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <View key={index} style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                      <IconComponent size={24} color="#FF8A80" />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('personalInfo')}</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('name')}:</Text>
                <Text style={styles.infoValue}>{user?.name || 'N/A'}</Text>
              </View>
              {user?.date_of_birth && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('dateDeNaissance')}:</Text>
                  <Text style={styles.infoValue}>{user.date_of_birth}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('contactInfo')}</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('email')}:</Text>
                <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
              </View>
              {user?.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('numeroTelephone')}:</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              )}
              {user?.address && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('adresse')}:</Text>
                  <Text style={styles.infoValue}>{user.address}</Text>
                </View>
              )}
              {user?.commune && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('commune')}:</Text>
                  <Text style={styles.infoValue}>{user.commune}</Text>
                </View>
              )}
              {user?.wilaya && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('wilaya')}:</Text>
                  <Text style={styles.infoValue}>{user.wilaya}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.section}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemIconContainer}>
                    <IconComponent size={24} color="#333" />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
            disabled={false}
            testID="logout-button"
          >
            <Text style={styles.logoutButtonText}>{t('logout')}</Text>
          </TouchableOpacity>

          {/* Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>{t('version')} 1.0.0</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <LanguageSwitcher
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        buttonPosition={buttonPosition}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    height: '25%',
    backgroundColor: '#FF8A80',
    position: 'relative',
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  languageButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  languageButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#FF8A80',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A80',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statIconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuItemIconContainer: {
    marginRight: 15,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#FF8A80',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfileScreen;
