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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AppHeader from '../components/AppHeader';
import { HandshakeIcon, LightbulbIcon, CalendarIcon, LocationIcon, UsersIcon, ArrowRightIcon } from '../components/Icons';
import { activitiesAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notificationCount] = useState(3); // Mock notification count
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Fetch activities from API
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activitiesAPI.getHomeActivities();
      
      if (response.success && response.data) {
        // Set featured activities (combined from all types)
        const featured = response.data.featured_activities || [];
        setFeaturedActivities(featured);

        // Set upcoming events (combine educations, clubs, and direct activities)
        const allActivities = [
          ...(response.data.educations || []),
          ...(response.data.clubs || []),
          ...(response.data.direct_activities || []),
        ];
        // Sort by date and take first 2
        const sorted = allActivities
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 2)
          .map(item => ({
            id: item.id,
            title: item.title,
            date: item.date,
            time: item.time || '9:00 AM',
            location: item.location || 'TBA',
          }));
        setUpcomingEvents(sorted);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Fallback to empty arrays on error
      setFeaturedActivities([]);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 1,
      title: t('volunteerNow'),
      icon: HandshakeIcon,
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
      icon: LightbulbIcon,
      color: '#FF8A80',
      onPress: () => {},
    },
    {
      id: 3,
      title: t('discoverActivities'),
      icon: CalendarIcon,
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
      icon: LocationIcon,
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader
          notificationCount={notificationCount}
          onProfilePress={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Profile');
            } else {
              navigation.navigate('Profile');
            }
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A80" />
          <Text style={styles.loadingText}>{t('loading') || 'Loading...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* App Header */}
      <AppHeader
        notificationCount={notificationCount}
        onNotificationPress={() => {
          // Navigate to notifications or show modal
          Alert.alert(t('notifications') || 'Notifications', `${notificationCount} new notifications`);
        }}
        onProfilePress={() => {
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate('Profile');
          } else {
            navigation.navigate('Profile');
          }
        }}
      />

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
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionCard}
                    onPress={action.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.quickActionIconContainer}>
                      <IconComponent size={32} color={action.color} />
                    </View>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                  </TouchableOpacity>
                );
              })}
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
              {featuredActivities.length > 0 ? (
                featuredActivities.map((activity) => (
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
                        {activity.category === 'Workshop' ? '📚' : activity.category === 'Volunteer' ? '🌱' : activity.category === 'Club' ? '👥' : '💻'}
                      </Text>
                    </View>
                    <View style={styles.activityCardContent}>
                      <Text style={styles.activityCardTitle} numberOfLines={2}>
                        {activity.title}
                      </Text>
                      <Text style={styles.activityCardCategory}>{activity.category || 'Activity'}</Text>
                      <View style={styles.activityCardFooter}>
                        <Text style={styles.activityCardDate}>{activity.date || 'TBA'}</Text>
                        <View style={styles.activityCardParticipantsRow}>
                          <UsersIcon size={14} color="#666" />
                          <Text style={styles.activityCardParticipants}>
                            {activity.participants || 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('noActivities') || 'No activities available'}</Text>
                </View>
              )}
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
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
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
                    <View style={styles.eventItemDetailRow}>
                      <CalendarIcon size={14} color="#666" />
                      <Text style={styles.eventItemDetail}>{event.date} • {event.time}</Text>
                    </View>
                    <View style={styles.eventItemDetailRow}>
                      <LocationIcon size={14} color="#666" />
                      <Text style={styles.eventItemDetail}>{event.location}</Text>
                    </View>
                  </View>
                  <ArrowRightIcon size={24} color="#FF8A80" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('noEvents') || 'No upcoming events'}</Text>
              </View>
            )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  quickActionIconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventItemDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  activityCardParticipantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityCardParticipants: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
    marginLeft: 6,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;
