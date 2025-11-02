import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import * as Location from 'expo-location';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import WaveSeparator from '../components/WaveSeparator';
import youthCentersData from '../data/youthCenters.json';

// Conditionally import MapView only on native platforms
let MapView, Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT;
if (Platform.OS !== 'web') {
  try {
    const mapsModule = require('react-native-maps');
    MapView = mapsModule.default;
    Marker = mapsModule.Marker;
    PROVIDER_GOOGLE = mapsModule.PROVIDER_GOOGLE;
    PROVIDER_DEFAULT = mapsModule.PROVIDER_DEFAULT;
  } catch (e) {
    console.warn('react-native-maps not available');
  }
}

const MapScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  // Set default location to Algeria center initially
  const [location, setLocation] = useState({
    latitude: 28.0339,
    longitude: 1.6596,
    latitudeDelta: 15,
    longitudeDelta: 15,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [youthCenters, setYouthCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Calculate map bounds from all youth centers
  const calculateMapBounds = (centers) => {
    if (!centers || centers.length === 0) {
      // Default to Algeria center if no centers
      return {
        latitude: 28.0339,
        longitude: 1.6596,
        latitudeDelta: 15,
        longitudeDelta: 15,
      };
    }

    const lats = centers.map(c => c.latitude).filter(lat => !isNaN(lat));
    const lngs = centers.map(c => c.longitude).filter(lng => !isNaN(lng));
    
    if (lats.length === 0 || lngs.length === 0) {
      return {
        latitude: 28.0339,
        longitude: 1.6596,
        latitudeDelta: 15,
        longitudeDelta: 15,
      };
    }
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.2; // Add 20% padding
    const lngDelta = (maxLng - minLng) * 1.2;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 8), // Minimum delta
      longitudeDelta: Math.max(lngDelta, 8),
    };
  };

  useEffect(() => {
    // Load youth centers from JSON file
    setYouthCenters(youthCentersData);

    // Set initial location immediately with default Algeria bounds
    const defaultBounds = calculateMapBounds(youthCentersData);
    setLocation(defaultBounds);

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

    // On web, use calculated bounds
    if (Platform.OS === 'web') {
      setLoading(false);
      return;
    }

    // Get user location if possible
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let mapBounds = calculateMapBounds(youthCentersData);

        if (status === 'granted') {
          try {
            let currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
              timeout: 5000,
            });
            // Use user location but ensure all centers are visible
            setLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: Math.max(mapBounds.latitudeDelta, 8),
              longitudeDelta: Math.max(mapBounds.longitudeDelta, 8),
            });
          } catch (e) {
            // If getting current location fails, use calculated bounds
            console.log('Using calculated bounds:', mapBounds);
            setLocation(mapBounds);
          }
        } else {
          // No permission, use calculated bounds
          setLocation(mapBounds);
        }

        setLoading(false);
      } catch (error) {
        console.error('Location error:', error);
        const bounds = calculateMapBounds(youthCentersData);
        setLocation(bounds);
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkerPress = (center) => {
    setSelectedCenter(center);
  };

  const handleRequestPermission = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setErrorMsg(null);
      } else {
        Alert.alert(t('locationPermission'), t('enableLocation'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('unexpectedError'));
    }
  };

  if (loading && !location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A80" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Web fallback - show activities list instead of map
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header with coral background */}
        <View style={styles.headerSection}>
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
            <Text style={styles.headerTitle}>{t('mapTitle')}</Text>
            <Text style={styles.headerSubtitle}>{t('mapSubtitle')}</Text>
          </Animated.View>
        </View>

        <ScrollView style={styles.scrollView}>
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.webNotice}>
              Map view is available on iOS and Android devices
            </Text>
            <Text style={styles.sectionTitle}>{t('nearbyActivities')}</Text>
            <Text style={styles.centerCount}>
              {youthCenters.length} {t('youthCenters') || 'Youth Centers'} {t('inAlgeria') || 'in Algeria'}
            </Text>
            {youthCenters.slice(0, 20).map((center) => (
              <TouchableOpacity
                key={center.id}
                style={styles.webActivityCard}
                onPress={() => handleMarkerPress(center)}
                activeOpacity={0.7}
              >
                <Text style={styles.webActivityTitle}>{center.name}</Text>
                <Text style={styles.webActivityLocation}>
                  📍 {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </ScrollView>

        {selectedCenter && (
          <View style={styles.activityCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCenter(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.activityTitle}>{selectedCenter.name}</Text>
            <Text style={styles.activityType}>{t('youthCenter') || 'Youth Center'}</Text>
            <Text style={styles.activityDate}>
              📍 {selectedCenter.latitude.toFixed(6)}, {selectedCenter.longitude.toFixed(6)}
            </Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => {
                setSelectedCenter(null);
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('Events');
                } else {
                  navigation.navigate('Events');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.detailsButtonText}>{t('viewDetails')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (errorMsg && !location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handleRequestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionButtonText}>{t('allowLocation')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Native platforms - show map
  if (!MapView) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerSection}>
          <Animated.View
            style={[
              styles.waveContainer,
              {
                opacity: waveAnim,
              },
            ]}
          >
            <WaveSeparator color="#FFFFFF" />
          </Animated.View>
          <Animated.View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('mapTitle')}</Text>
            <Text style={styles.headerSubtitle}>{t('mapSubtitle')}</Text>
          </Animated.View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Map requires a custom development build
          </Text>
          <Text style={[styles.errorText, { marginTop: 10, fontSize: 14 }]}>
            react-native-maps doesn't work in Expo Go
          </Text>
          <Text style={[styles.errorText, { marginTop: 10, fontSize: 12, color: '#999' }]}>
            Run: npx expo prebuild{'\n'}Then: npx expo run:ios or npx expo run:android
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with coral background */}
      <View style={styles.headerSection}>
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
          <Text style={styles.headerTitle}>{t('mapTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('mapSubtitle')}</Text>
        </Animated.View>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={location}
            region={location}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
            mapType="standard"
            zoomEnabled={true}
            scrollEnabled={true}
            rotateEnabled={true}
            pitchEnabled={false}
            toolbarEnabled={Platform.OS === 'android'}
            loadingEnabled={true}
            loadingIndicatorColor="#FF8A80"
            loadingBackgroundColor="#FFFFFF"
            onMapReady={() => {
              console.log('Map is ready and loaded');
              console.log('Map region:', location);
              console.log('Youth centers count:', youthCenters.length);
              setLoading(false);
            }}
            onError={(error) => {
              console.error('Map error:', error);
              Alert.alert(t('error'), 'Map failed to load. Check console for details.');
            }}
            onLoad={() => {
              console.log('Map loaded successfully');
            }}
          >
            {youthCenters.length > 0 && youthCenters.map((center) => (
              <Marker
                key={center.id}
                coordinate={{
                  latitude: center.latitude,
                  longitude: center.longitude,
                }}
                title={center.name}
                description={t('youthCenter') || 'Youth Center'}
                onPress={() => handleMarkerPress(center)}
                pinColor="#FF8A80"
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator size="large" color="#FF8A80" />
            <Text style={styles.mapPlaceholderText}>{t('loading')}...</Text>
          </View>
        )}
      </View>

      {/* Youth Center Details Card */}
      {selectedCenter && (
        <View style={styles.activityCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedCenter(null)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.activityTitle}>{selectedCenter.name}</Text>
          <Text style={styles.activityType}>{t('youthCenter') || 'Youth Center'}</Text>
          <Text style={styles.activityDate}>
            📍 {selectedCenter.latitude.toFixed(6)}, {selectedCenter.longitude.toFixed(6)}
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
              setSelectedCenter(null);
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('Events');
              } else {
                navigation.navigate('Events');
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.detailsButtonText}>{t('viewDetails')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nearby Centers List */}
      <ScrollView
        horizontal
        style={styles.nearbyList}
        showsHorizontalScrollIndicator={false}
      >
        {youthCenters.slice(0, 10).map((center) => (
          <TouchableOpacity
            key={center.id}
            style={styles.nearbyCard}
            onPress={() => handleMarkerPress(center)}
            activeOpacity={0.7}
          >
            <Text style={styles.nearbyCardTitle} numberOfLines={2}>{center.name}</Text>
            <Text style={styles.nearbyCardType}>{t('youthCenter') || 'Youth Center'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#FF8A80',
    paddingHorizontal: 30,
    paddingVertical: 15,
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
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  webNotice: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 24,
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  webActivityCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  centerCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontWeight: '600',
  },
  webActivityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  webActivityType: {
    fontSize: 14,
    color: '#FF8A80',
    fontWeight: '600',
    marginBottom: 4,
  },
  webActivityDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  webActivityLocation: {
    fontSize: 12,
    color: '#999',
  },
  activityCard: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginRight: 30,
  },
  activityType: {
    fontSize: 14,
    color: '#FF8A80',
    marginBottom: 8,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  detailsButton: {
    backgroundColor: '#FF8A80',
    paddingVertical: 12,
    borderRadius: 12,
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
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nearbyList: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  nearbyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    width: 150,
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
        elevation: 4,
      },
    }),
  },
  nearbyCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nearbyCardType: {
    fontSize: 12,
    color: '#666',
  },
});

export default MapScreen;
