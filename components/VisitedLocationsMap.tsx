import React, { useMemo, memo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

export interface VisitedLocation {
  id: string;
  storeName: string;
  latitude: number;
  longitude: number;
  visitCount: number;
}

interface VisitedLocationsMapProps {
  locations: VisitedLocation[];
  height?: number;
}

const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const VisitedLocationsMap: React.FC<VisitedLocationsMapProps> = memo(
  ({ locations, height = 250 }) => {
    // Calculate the region to fit all markers
    const mapRegion = useMemo(() => {
      if (locations.length === 0) {
        return DEFAULT_REGION;
      }

      const lats = locations.map((l) => l.latitude);
      const lngs = locations.map((l) => l.longitude);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      // Add padding to the delta
      const latDelta = Math.max((maxLat - minLat) * 1.5, 0.02);
      const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.02);

      return {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      };
    }, [locations]);

    // Get marker color based on visit count
    const getMarkerColor = (visitCount: number): string => {
      if (visitCount >= 10) return '#FF5722'; // Hot - Orange Red
      if (visitCount >= 5) return '#FF9800'; // Warm - Orange
      if (visitCount >= 3) return '#FFC107'; // Medium - Yellow
      return COLORS.primary; // Default
    };

    if (locations.length === 0) {
      return (
        <View style={[styles.container, { height }]}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyText}>No locations yet</Text>
            <Text style={styles.emptySubtext}>
              Add drinks with location data to see them on the map
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>📍 Your Boba Map</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={mapRegion}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
            pitchEnabled={false}
            rotateEnabled={false}>
            {locations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.storeName}
                description={`${location.visitCount} visit${location.visitCount > 1 ? 's' : ''}`}
                pinColor={getMarkerColor(location.visitCount)}
              />
            ))}
          </MapView>
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>1-2 visits</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>3-4 visits</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>5-9 visits</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF5722' }]} />
            <Text style={styles.legendText}>10+ visits</Text>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text.accent,
    marginBottom: SPACING.sm,
  },
  mapContainer: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    height: 180,
  },
  map: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
  },
});

export default VisitedLocationsMap;
