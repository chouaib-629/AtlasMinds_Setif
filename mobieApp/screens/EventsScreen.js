import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import { CalendarIcon, LocationIcon, UserIcon, UsersIcon } from '../components/Icons';

const EventsScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [notificationCount] = useState(3); // Mock notification count

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const categories = ['all', 'Workshop', 'Training', 'Volunteer', 'Event', 'Conference'];

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

    // Fetch events (mock data for now)
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Youth Leadership Workshop',
          description: 'Learn essential leadership skills and network with other young leaders.',
          category: 'Workshop',
          date: '2024-01-15',
          time: '10:00 AM',
          location: 'Community Center',
          type: 'In Person',
          price: 'Free',
          organizer: 'Youth Organization',
          participants: 45,
          capacity: 50,
        },
        {
          id: 2,
          title: 'Digital Skills Training',
          description: 'Master digital tools and technologies for your career.',
          category: 'Training',
          date: '2024-01-20',
          time: '2:00 PM',
          location: 'Online',
          type: 'Virtual',
          price: 'Free',
          organizer: 'Tech Hub',
          participants: 120,
          capacity: 200,
        },
        {
          id: 3,
          title: 'Community Cleanup Day',
          description: 'Join us for a day of community service and environmental action.',
          category: 'Volunteer',
          date: '2024-01-25',
          time: '9:00 AM',
          location: 'City Park',
          type: 'In Person',
          price: 'Free',
          organizer: 'Green Initiative',
          participants: 80,
          capacity: 100,
        },
        {
          id: 4,
          title: 'Entrepreneurship Conference',
          description: 'Connect with successful entrepreneurs and learn from their experiences.',
          category: 'Conference',
          date: '2024-02-01',
          time: '9:00 AM',
          location: 'Convention Center',
          type: 'In Person',
          price: 'Paid - 500 DZD',
          organizer: 'Business Network',
          participants: 200,
          capacity: 300,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRegister = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  const renderEventCard = ({ item }) => {
    const isRegistered = registeredEvents.includes(item.id);
    const isFull = item.participants >= item.capacity;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => {
          // Navigate to event details
          navigation.navigate('EventDetails', { event: item });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleContainer}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <View style={styles.eventBadges}>
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
              <View style={[styles.badge, item.type === 'Virtual' ? styles.virtualBadge : styles.inPersonBadge]}>
                <Text style={styles.badgeText}>{t(item.type.toLowerCase().replace(' ', ''))}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailRow}>
            <View style={styles.eventDetailIconContainer}>
              <CalendarIcon size={16} color="#666" />
            </View>
            <Text style={styles.eventDetailLabel}>{t('date')}:</Text>
            <Text style={styles.eventDetailValue}>{item.date} {item.time}</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <View style={styles.eventDetailIconContainer}>
              <LocationIcon size={16} color="#666" />
            </View>
            <Text style={styles.eventDetailLabel}>{t('location')}:</Text>
            <Text style={styles.eventDetailValue}>{item.location}</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <View style={styles.eventDetailIconContainer}>
              <UserIcon size={16} color="#666" />
            </View>
            <Text style={styles.eventDetailLabel}>{t('organizer')}:</Text>
            <Text style={styles.eventDetailValue}>{item.organizer}</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Text style={styles.eventDetailLabel}>{t('price')}:</Text>
            <Text style={styles.eventDetailValue}>{item.price}</Text>
          </View>
          <View style={styles.eventDetailRow}>
            <View style={styles.eventDetailIconContainer}>
              <UsersIcon size={16} color="#666" />
            </View>
            <Text style={styles.eventDetailLabel}>{t('participants')}:</Text>
            <Text style={styles.eventDetailValue}>{item.participants}/{item.capacity}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.registerButton,
            isRegistered && styles.registeredButton,
            isFull && !isRegistered && styles.fullButton,
          ]}
          onPress={() => handleRegister(item.id)}
          disabled={isFull && !isRegistered}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>
            {isRegistered
              ? t('registered')
              : isFull
              ? t('full')
              : t('register')}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader
          notificationCount={notificationCount}
          onProfilePress={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Profile');
            }
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A80" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
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
          // Navigate to notifications
        }}
        onProfilePress={() => {
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate('Profile');
          }
        }}
      />

      {/* White content section */}
      <View style={styles.contentSection}>
        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchEvents')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0A0A0"
          />
        </Animated.View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          style={styles.categoryContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                filterCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setFilterCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  filterCategory === category && styles.categoryChipTextActive,
                ]}
              >
                {category === 'all' ? t('allActivities') : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.eventsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('noEvents')}</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentSection: {
    flex: 1,
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: {
    backgroundColor: '#FF8A80',
    borderColor: '#FF8A80',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  eventsList: {
    padding: 24,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  eventHeader: {
    marginBottom: 12,
  },
  eventTitleContainer: {
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
  },
  virtualBadge: {
    backgroundColor: '#FFF3E0',
  },
  inPersonBadge: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 15,
  },
  eventDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  eventDetailIconContainer: {
    marginRight: 6,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    minWidth: 80,
  },
  eventDetailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
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
  registeredButton: {
    backgroundColor: '#34C759',
  },
  fullButton: {
    backgroundColor: '#FF3B30',
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default EventsScreen;
