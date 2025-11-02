import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

const LeafletMap = ({ centers, selectedCenter, onMarkerClick, height = '600px' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!window.L || !mapContainerRef.current || mapInstanceRef.current) return;

      // Calculate center of all markers (Algeria center or average of centers)
      let centerLat = 28.0339;
      let centerLng = 1.6596;
      let zoom = 6;

      if (centers && centers.length > 0) {
        const lats = centers.map(c => c.latitude).filter(lat => !isNaN(lat));
        const lngs = centers.map(c => c.longitude).filter(lng => !isNaN(lng));
        
        if (lats.length > 0 && lngs.length > 0) {
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          
          centerLat = (minLat + maxLat) / 2;
          centerLng = (minLng + maxLng) / 2;
          
          // Calculate zoom level to fit all markers
          const latDelta = maxLat - minLat;
          const lngDelta = maxLng - minLng;
          const maxDelta = Math.max(latDelta, lngDelta);
          
          if (maxDelta > 10) zoom = 6;
          else if (maxDelta > 5) zoom = 7;
          else if (maxDelta > 2) zoom = 8;
          else if (maxDelta > 1) zoom = 9;
          else zoom = 10;
        }
      }

      // Initialize map
      const map = window.L.map(mapContainerRef.current).setView([centerLat, centerLng], zoom);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add markers for each youth center
      if (centers && centers.length > 0) {
        centers.forEach((center) => {
          if (!center.latitude || !center.longitude || isNaN(center.latitude) || isNaN(center.longitude)) {
            return;
          }

          // Create custom icon
          const customIcon = window.L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 30px;
              height: 30px;
              background-color: #FF8A80;
              border: 3px solid #fff;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background-color: #fff;
                border-radius: 50%;
              "></div>
            </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15],
          });

          // Create marker
          const marker = window.L.marker([center.latitude, center.longitude], {
            icon: customIcon,
          }).addTo(map);
          
          // Store center data in marker for reference
          marker.options.center = center;

          // Add popup with center information
          const popupContent = `
            <div style="
              padding: 12px;
              min-width: 200px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              <h3 style="
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 600;
                color: #333;
              ">${center.name || 'Youth Center'}</h3>
              <p style="
                margin: 0;
                font-size: 12px;
                color: #666;
              ">
                <strong>Coordinates:</strong><br>
                ${center.latitude.toFixed(6)}, ${center.longitude.toFixed(6)}
              </p>
            </div>
          `;
          
          marker.bindPopup(popupContent);

          // Add click handler to trigger onMarkerClick
          marker.on('click', () => {
            if (onMarkerClick) {
              onMarkerClick(center);
            }
          });

          markersRef.current.push(marker);
        });
      }

      // Fit bounds to show all markers
      if (markersRef.current.length > 0) {
        const group = new window.L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [centers, onMarkerClick]);

  // Update selected marker highlight
  useEffect(() => {
    if (!window.L || !mapInstanceRef.current || !selectedCenter) return;

    let foundMarker = null;
    markersRef.current.forEach((marker) => {
      const center = marker.options.center;
      
      if (center && center.id === selectedCenter.id) {
        foundMarker = marker;
      } else if (center && 
          Math.abs(center.latitude - selectedCenter.latitude) < 0.0001 &&
          Math.abs(center.longitude - selectedCenter.longitude) < 0.0001) {
        foundMarker = marker;
      }
    });

    if (foundMarker) {
      // Open popup and zoom to marker
      foundMarker.openPopup();
      mapInstanceRef.current.setView([selectedCenter.latitude, selectedCenter.longitude], 13, {
        animate: true,
      });
    }
  }, [selectedCenter]);

  return (
    <View style={[styles.container, { height }]}>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
});

export default LeafletMap;

