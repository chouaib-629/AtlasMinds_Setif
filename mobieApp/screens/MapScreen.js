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
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import { LocationIcon, MapIcon } from '../components/Icons';
import LeafletMap from '../components/LeafletMap';
import youthCentersData from '../data/youthCenters.json';

// Conditionally import MapView only on native platforms
let MapView, Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT;
if (Platform.OS !== 'web') {
  try {
    // Dynamic import to avoid web bundling issues
    const mapsModule = require('react-native-maps');
    MapView = mapsModule.default;
    Marker = mapsModule.Marker;
    PROVIDER_GOOGLE = mapsModule.PROVIDER_GOOGLE;
    PROVIDER_DEFAULT = mapsModule.PROVIDER_DEFAULT;
  } catch (e) {
    MapView = null;
    Marker = null;
    PROVIDER_GOOGLE = null;
    PROVIDER_DEFAULT = null;
  }
} else {
  // Explicitly set to null on web to prevent any import evaluation
  MapView = null;
  Marker = null;
  PROVIDER_GOOGLE = null;
  PROVIDER_DEFAULT = null;
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
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const [notificationCount] = useState(3); // Mock notification count

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
            setLocation(mapBounds);
          }
        } else {
          // No permission, use calculated bounds
          setLocation(mapBounds);
        }

        setLoading(false);
      } catch (error) {
        const bounds = calculateMapBounds(youthCentersData);
        setLocation(bounds);
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkerPress = (center) => {
    setSelectedCenter(center);
    // Zoom to selected marker
    if (mapRef.current && center.latitude && center.longitude) {
      mapRef.current.animateToRegion({
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 500);
    }
  };

  const fitAllMarkers = () => {
    if (mapRef.current && youthCenters.length > 0) {
      const bounds = calculateMapBounds(youthCenters);
      mapRef.current.animateToRegion(bounds, 1000);
    }
  };

  const filteredCenters = searchQuery
    ? youthCenters.filter(center =>
        center.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : youthCenters;

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

  // Web - show Leaflet map
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* App Header */}
        <AppHeader
          notificationCount={notificationCount}
          onNotificationPress={() => {}}
          onProfilePress={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Profile');
            }
          }}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchCenters') || 'Search youth centers...'}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.fitAllButton}
            onPress={() => {
              // Scroll to map on web
              const mapElement = document.querySelector('[data-map-container]');
              if (mapElement) {
                mapElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            activeOpacity={0.8}
          >
            <MapIcon size={20} color="#fff" />
            <Text style={styles.fitAllButtonText}>{t('showAll') || 'Show All'}</Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Leaflet Map */}
        <View style={styles.leafletMapContainer} data-map-container>
          <LeafletMap
            centers={filteredCenters}
            selectedCenter={selectedCenter}
            onMarkerClick={handleMarkerPress}
            height="calc(100vh - 350px)"
          />
        </View>

        {/* Selected Center Preview Card */}
        {selectedCenter && (
          <View style={styles.webPreviewCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCenter(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.activityTitle}>{selectedCenter.name}</Text>
            <Text style={styles.activityType}>{t('youthCenter') || 'Youth Center'}</Text>
            <View style={styles.activityLocationRow}>
              <LocationIcon size={14} color="#666" />
              <Text style={styles.activityDate}>
                {selectedCenter.latitude.toFixed(6)}, {selectedCenter.longitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewLabel}>{t('location') || 'Location'}:</Text>
              <Text style={styles.previewText}>
                Latitude: {selectedCenter.latitude.toFixed(6)}
              </Text>
              <Text style={styles.previewText}>
                Longitude: {selectedCenter.longitude.toFixed(6)}
              </Text>
            </View>
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

        {/* Centers Count Info */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {filteredCenters.length} {t('youthCenters') || 'Youth Centers'} {t('inAlgeria') || 'in Algeria'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg && !location) {
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* App Header */}
      <AppHeader
        notificationCount={notificationCount}
        onNotificationPress={() => {}}
        onProfilePress={() => {
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate('Profile');
          }
        }}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchCenters') || 'Search youth centers...'}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.fitAllButton}
          onPress={fitAllMarkers}
          activeOpacity={0.8}
        >
          <MapIcon size={20} color="#fff" />
          <Text style={styles.fitAllButtonText}>{t('showAll') || 'Show All'}</Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {!MapView || !Marker ? (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderIcon}>🗺️</Text>
            <Text style={styles.mapPlaceholderTitle}>
              {Platform.OS === 'web' 
                ? t('mapNotSupported') || 'Map not supported on web'
                : t('mapNotAvailable') || 'Map not available'}
            </Text>
            <Text style={styles.mapPlaceholderText}>
              {Platform.OS === 'web'
                ? t('mapWebMessage') || 'Please use the mobile app for map features.'
                : t('mapErrorMessage') || 'react-native-maps is not available. Please rebuild the app with native dependencies.'}
            </Text>
            {youthCenters.length > 0 && (
              <View style={styles.centersListFallback}>
                <Text style={styles.centersListTitle}>{t('nearbyActivities') || 'Nearby Activities'}</Text>
                <ScrollView style={styles.centersListScroll}>
                  {youthCenters.map((center) => (
                    <TouchableOpacity
                      key={center.id}
                      style={styles.centerListItem}
                      onPress={() => handleMarkerPress(center)}
                      activeOpacity={0.7}
                    >
                      <LocationIcon size={20} color="#FF8A80" />
                      <View style={styles.centerListItemContent}>
                        <Text style={styles.centerListItemName}>{center.name}</Text>
                        <Text style={styles.centerListItemLocation}>
                          {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        ) : location ? (
          <MapView
            ref={mapRef}
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
              setLoading(false);
            }}
            onError={(error) => {
              setErrorMsg('Map failed to load. Please check your internet connection and try again.');
              Alert.alert(t('error'), 'Map failed to load. Please try again.');
            }}
            onLoad={() => {
              setLoading(false);
              // Fit all markers after map is loaded
              setTimeout(() => {
                fitAllMarkers();
              }, 500);
            }}
            onRegionChangeComplete={(region) => {
              setLocation(region);
            }}
          >
            {filteredCenters.length > 0 && filteredCenters.map((center) => (
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
          <View style={styles.activityLocationRow}>
            <LocationIcon size={14} color="#666" />
            <Text style={styles.activityDate}>
              {selectedCenter.latitude.toFixed(6)}, {selectedCenter.longitude.toFixed(6)}
            </Text>
          </View>
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

      {/* Centers Count Info */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {filteredCenters.length} {t('youthCenters') || 'Youth Centers'} {t('inAlgeria') || 'in Algeria'}
        </Text>
      </View>

      {/* Nearby Centers List */}
      {selectedCenter && (
        <ScrollView
          horizontal
          style={styles.nearbyList}
          showsHorizontalScrollIndicator={false}
        >
          {filteredCenters.slice(0, 10).map((center) => (
            <TouchableOpacity
              key={center.id}
              style={[
                styles.nearbyCard,
                selectedCenter.id === center.id && styles.nearbyCardSelected
              ]}
              onPress={() => handleMarkerPress(center)}
              activeOpacity={0.7}
            >
              <Text style={styles.nearbyCardTitle} numberOfLines={2}>{center.name}</Text>
              <Text style={styles.nearbyCardType}>{t('youthCenter') || 'Youth Center'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 8,
  },
  fitAllButton: {
    flexDirection: 'row',
    backgroundColor: '#FF8A80',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A80',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  fitAllButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  infoBar: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  leafletMapContainer: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    position: 'relative',
    zIndex: 0,
  },
  webPreviewCard: {
    position: 'fixed',
    bottom: 20,
    left: 20,
    right: 20,
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 1000,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      default: {},
    }),
  },
  previewInfo: {
    marginTop: 12,
    marginBottom: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  previewText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
    ...Platform.select({
      web: {
        fontFamily: 'monospace',
      },
      default: {},
    }),
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
    padding: 24,
  },
  mapPlaceholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  mapPlaceholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  mapPlaceholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  centersListFallback: {
    marginTop: 32,
    width: '100%',
    maxHeight: 400,
  },
  centersListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  centersListScroll: {
    maxHeight: 350,
  },
  centerListItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  centerListItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  centerListItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  centerListItemLocation: {
    fontSize: 12,
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
  webActivityLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  webActivityLocation: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },
  activityLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  nearbyCardSelected: {
    borderColor: '#FF8A80',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
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
