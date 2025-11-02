import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import WaveSeparator from '../components/WaveSeparator';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const languageButtonRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Welcome animations
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

  const getLanguageDisplay = () => {
    const langMap = {
      en: 'EN',
      fr: 'FR',
      ar: 'AR',
    };
    return langMap[language] || 'EN';
  };

  const quickActions = [
    {
      id: 1,
      title: t('volunteerNow'),
      icon: '🤝',
      color: '#FF8A80',
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
      title: t('suggestProject'),
      icon: '💡',
      color: '#FF8A80',
      onPress: () => {},
    },
    {
      id: 3,
      title: t('discoverActivities'),
      icon: '📅',
      color: '#FF8A80',
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
      id: 4,
      title: t('map'),
      icon: '📍',
      color: '#FF8A80',
      onPress: () => {
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Map');
        } else {
          navigation.navigate('Map');
        }
      },
    },
  ];

  const featuredActivities = [
    {
      id: 1,
      title: 'Youth Leadership Workshop',
      category: 'Workshop',
      date: 'Jan 15, 2024',
      participants: 45,
    },
    {
      id: 2,
      title: 'Community Cleanup Day',
      category: 'Volunteer',
      date: 'Jan 25, 2024',
      participants: 80,
    },
    {
      id: 3,
      title: 'Digital Skills Training',
      category: 'Training',
      date: 'Jan 20, 2024',
      participants: 120,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Innovation Summit',
      date: 'Feb 5, 2024',
      time: '9:00 AM',
      location: 'Convention Center',
    },
    {
      id: 2,
      title: 'Arts & Culture Festival',
      date: 'Feb 10, 2024',
      time: '2:00 PM',
      location: 'City Park',
    },
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
          <Text style={styles.greeting}>{t('welcome')},</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </Animated.View>
      </View>

      {/* White content section */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('discoverActivities')}</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Featured Activities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('featuredActivities')}</Text>
              <TouchableOpacity
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Events');
                  } else {
                    navigation.navigate('Events');
                  }
                }}
              >
                <Text style={styles.seeAllText}>{t('viewAll')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.activitiesScroll}
            >
              {featuredActivities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={styles.activityCard}
                  onPress={() => {
                    const parent = navigation.getParent();
                    if (parent) {
                      parent.navigate('Events');
                    } else {
                      navigation.navigate('Events');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityImagePlaceholder}>
                    <Text style={styles.activityImageText}>
                      {activity.category === 'Workshop' ? '📚' : activity.category === 'Volunteer' ? '🌱' : '💻'}
                    </Text>
                  </View>
                  <View style={styles.activityCardContent}>
                    <Text style={styles.activityCardTitle} numberOfLines={2}>
                      {activity.title}
                    </Text>
                    <Text style={styles.activityCardCategory}>{activity.category}</Text>
                    <View style={styles.activityCardFooter}>
                      <Text style={styles.activityCardDate}>{activity.date}</Text>
                      <Text style={styles.activityCardParticipants}>
                        👥 {activity.participants}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Upcoming Events */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('upcomingEvents')}</Text>
              <TouchableOpacity
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Events');
                  } else {
                    navigation.navigate('Events');
                  }
                }}
              >
                <Text style={styles.seeAllText}>{t('seeMore')}</Text>
              </TouchableOpacity>
            </View>
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Events');
                  } else {
                    navigation.navigate('Events');
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.eventItemContent}>
                  <Text style={styles.eventItemTitle}>{event.title}</Text>
                  <Text style={styles.eventItemDetail}>📅 {event.date} • {event.time}</Text>
                  <Text style={styles.eventItemDetail}>📍 {event.location}</Text>
                </View>
                <Text style={styles.eventItemArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* My Activities Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('myActivities')}</Text>
              <TouchableOpacity
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Profile');
                  } else {
                    navigation.navigate('Profile');
                  }
                }}
              >
                <Text style={styles.seeAllText}>{t('viewAll')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.myActivitiesCard}>
              <Text style={styles.myActivitiesText}>{t('noActivities')}</Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate('Events');
                  } else {
                    navigation.navigate('Events');
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.exploreButtonText}>{t('discoverActivities')}</Text>
              </TouchableOpacity>
            </View>
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
    height: '35%',
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
    bottom: 80,
    left: 24,
    right: 24,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF8A80',
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
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
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  activitiesScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  activityCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
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
  activityImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityImageText: {
    fontSize: 48,
  },
  activityCardContent: {
    padding: 16,
  },
  activityCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  activityCardCategory: {
    fontSize: 12,
    color: '#FF8A80',
    fontWeight: '600',
    marginBottom: 8,
  },
  activityCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityCardDate: {
    fontSize: 12,
    color: '#666',
  },
  activityCardParticipants: {
    fontSize: 12,
    color: '#666',
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eventItemContent: {
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  eventItemDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventItemArrow: {
    fontSize: 24,
    color: '#FF8A80',
    marginLeft: 10,
  },
  myActivitiesCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  myActivitiesText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#FF8A80',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
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
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreen;
