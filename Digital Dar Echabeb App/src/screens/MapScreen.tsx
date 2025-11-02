import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../lib/context';
import { Search, MapPin, List } from 'lucide-react';
import { Input } from '../components/ui/input';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import youthCentersData from '../data/youthCenters.json';

// Fix for default markers in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapScreenProps {
  onCenterClick: (centerId: string) => void;
}

// Calculate distance between two coordinates using Haversine formula (in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Component to fit map bounds to show all markers or zoom to nearest
function MapBoundsFit({ centers, userLocation, nearestCenter, isLocating }: { 
  centers: typeof youthCentersData; 
  userLocation?: [number, number];
  nearestCenter?: { latitude: number; longitude: number };
  isLocating?: boolean;
}) {
  const map = useMap();
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    // Show all centers immediately while locating
    if (!hasInitialized && centers.length > 0) {
      const bounds = L.latLngBounds(
        centers.map(center => [center.latitude, center.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], animate: false }); // Instant to show map quickly
      setHasInitialized(true);
    }
    
    // Zoom to user and nearest center when location is found
    if (userLocation && nearestCenter && !isLocating) {
      const bounds = L.latLngBounds(
        [userLocation, [nearestCenter.latitude, nearestCenter.longitude]]
      );
      // Quick zoom without animation for speed
      map.fitBounds(bounds, {
        padding: [100, 100],
        maxZoom: 14,
        animate: false, // No animation for instant zoom
      });
    }
  }, [map, centers, userLocation, nearestCenter, isLocating, hasInitialized]);
  
  return null;
}

// Component to handle user location marker
function UserLocationMarker({ position, label }: { position: [number, number]; label: string }) {
  return position ? (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'user-location-marker',
        html: `<div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #3b82f6;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })}
    >
      <Popup>
        <div className="p-2">
          <p className="text-xs font-semibold">{label}</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

export function MapScreen({ onCenterClick }: MapScreenProps) {
  const { t, language } = useApp();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestCenter, setNearestCenter] = useState<{ id: string; name: string; latitude: number; longitude: number; distance?: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Calculate center of Algeria for initial map view
  const algeriaCenter: [number, number] = [28.0339, 1.6596];
  
  // Use youth centers from JSON file
  const youthCenters = useMemo(() => {
    return (youthCentersData as typeof youthCentersData).map((center) => ({
      ...center,
      // Convert numeric id to string for consistency
      id: String(center.id),
    }));
  }, []);

  // Get user location and find nearest center - optimized for speed
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.');
        return;
      }

      setIsLocating(true);
      
      // Use faster options: lower accuracy, shorter timeout, allow cached location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc: [number, number] = [latitude, longitude];
          setUserLocation(userLoc);

          // Optimized: Find nearest center using two-pass approach
          // First pass: approximate distance to find top candidates
          const candidates: Array<{ center: typeof youthCenters[0]; approxDist: number }> = [];
          
          for (let i = 0; i < youthCenters.length; i++) {
            const center = youthCenters[i];
            // Fast approximate distance (squared Euclidean - no sqrt needed for comparison)
            const dLat = latitude - center.latitude;
            const dLon = longitude - center.longitude;
            const approxDist = dLat * dLat + dLon * dLon;
            candidates.push({ center, approxDist });
          }
          
          // Sort by approximate distance and only check top 10 candidates
          candidates.sort((a, b) => a.approxDist - b.approxDist);
          const topCandidates = candidates.slice(0, Math.min(10, candidates.length));
          
          // Second pass: exact distance for top candidates only
          let nearest = null;
          let minDistance = Infinity;
          
          for (const { center } of topCandidates) {
            const distance = calculateDistance(
              latitude,
              longitude,
              center.latitude,
              center.longitude
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearest = {
                ...center,
                distance,
              };
            }
          }

          if (nearest) {
            setNearestCenter(nearest);
          }
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          // Fallback: show all centers if location is denied
        },
        {
          enableHighAccuracy: false, // Faster, uses cached location if available
          timeout: 5000, // Reduced from 10s to 5s
          maximumAge: 300000, // Accept cached location up to 5 minutes old
        }
      );
    };

    // Get location when component mounts - don't block map rendering
    // Use a small delay to let map render first
    const timeoutId = setTimeout(getLocation, 100);
    return () => clearTimeout(timeoutId);
  }, [youthCenters]);

  const filters = [
    { id: 'sports', label: t('رياضة', 'Sports') },
    { id: 'learning', label: t('تعليم', 'Learning') },
    { id: 'social', label: t('اجتماعي', 'Social') },
    { id: 'environmental', label: t('بيئي', 'Environmental') },
    { id: 'e-sport', label: t('رياضة إلكترونية', 'E-Sports') },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="h-screen flex flex-col pb-20">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('ابحث عن مركز...', 'Search for center...')}
                className="pr-10"
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {viewMode === 'map' ? (
                <List className="w-6 h-6" />
              ) : (
                <MapPin className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedFilters.includes(filter.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map / List View */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'map' ? (
          <div className="relative h-full w-full">
            {/* Leaflet Map */}
            <MapContainer
              center={algeriaCenter}
              zoom={6}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Fit bounds to show user location and nearest center, or all markers */}
              <MapBoundsFit 
                centers={youthCenters} 
                userLocation={userLocation || undefined}
                nearestCenter={nearestCenter || undefined}
                isLocating={isLocating}
              />
              
              {/* User location marker */}
              {userLocation && <UserLocationMarker position={userLocation} label={t('موقعك الحالي', 'Your Location')} />}
              
              {/* Markers for each youth center */}
              {youthCenters.map((center) => {
                const isNearest = nearestCenter?.id === center.id;
                return (
                <Marker
                  key={center.id}
                  position={[center.latitude, center.longitude]}
                  icon={L.icon({
                    iconUrl: isNearest 
                      ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png'
                      : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                    iconSize: isNearest ? [30, 48] : [25, 41],
                    iconAnchor: isNearest ? [15, 48] : [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                    className: isNearest ? 'nearest-marker' : '',
                  })}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm mb-1">
                        {center.name}
                        {isNearest && (
                          <span className="ml-2 text-xs text-primary">
                            ({t('الأقرب', 'Nearest')})
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {t('مركز شباب', 'Youth Center')}
                      </p>
                      {isNearest && nearestCenter?.distance && (
                        <p className="text-xs text-primary mb-2">
                          {nearestCenter.distance.toFixed(1)} {t('كم', 'km')} {t('من موقعك', 'away')}
                        </p>
                      )}
                      <button
                        onClick={() => onCenterClick(center.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        {t('عرض التفاصيل', 'View Details')}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
              })}
            </MapContainer>

            {/* Nearest Centers List (Bottom Sheet Style) */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm rounded-t-3xl border-t border-border shadow-2xl max-h-[40vh] overflow-y-auto z-[1000]">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {nearestCenter 
                        ? t('أقرب مركز', 'Nearest Center') 
                        : t('مراكز الشباب', 'Youth Centers')}
                    </h3>
                    {isLocating && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('جاري تحديد موقعك...', 'Locating...')}
                      </p>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {youthCenters.length} {t('مركز', 'centers')}
                  </span>
                </div>
                
                <div className="space-y-3 max-h-[30vh] overflow-y-auto">
                  {/* Show nearest center first if available */}
                  {nearestCenter && (
                    <div
                      onClick={() => onCenterClick(nearestCenter.id)}
                      className="p-3 rounded-lg border-2 border-primary bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">{nearestCenter.name}</h4>
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              {t('أقرب', 'Nearest')}
                            </span>
                          </div>
                          {nearestCenter.distance && (
                            <p className="text-xs text-primary font-medium">
                              {nearestCenter.distance.toFixed(1)} {t('كم', 'km')} {t('من موقعك', 'away')}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {nearestCenter.latitude.toFixed(4)}, {nearestCenter.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {youthCenters
                    .filter(c => !nearestCenter || c.id !== nearestCenter.id)
                    .slice(0, nearestCenter ? 4 : 5)
                    .map((center) => (
                    <div
                      key={center.id}
                      onClick={() => onCenterClick(center.id)}
                      className="p-3 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{center.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {youthCenters.length > 5 && (
                    <p className="text-xs text-center text-muted-foreground pt-2">
                      {t('و', 'and')} {youthCenters.length - 5} {t('مراكز أخرى على الخريطة', 'more centers on the map')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t('جميع المراكز', 'All Centers')}</h3>
              <span className="text-muted-foreground text-sm">
                {youthCenters.length} {t('مركز', 'centers')}
              </span>
            </div>
            
            {youthCenters.map((center) => (
              <div
                key={center.id}
                onClick={() => onCenterClick(center.id)}
                className="p-4 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1">{center.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
