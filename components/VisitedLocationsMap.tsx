import React, { useMemo, memo, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VisitedLocationsMap: React.FC<VisitedLocationsMapProps> = memo(
  ({ locations, height = 250 }) => {
    const mapRef = useRef<MapView>(null);
    const fullScreenMapRef = useRef<MapView>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

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

    const handleOpenFullScreen = useCallback(() => {
      setIsFullScreen(true);
    }, []);

    const handleCloseFullScreen = useCallback(() => {
      setIsFullScreen(false);
    }, []);

    const handleGoToCurrentLocation = useCallback(async () => {
      setIsLocating(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const currentRegion: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        fullScreenMapRef.current?.animateToRegion(currentRegion, 500);
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to get current location:', error);
        }
      } finally {
        setIsLocating(false);
      }
    }, []);

    const handleFitAllMarkers = useCallback(() => {
      fullScreenMapRef.current?.animateToRegion(mapRegion, 500);
    }, [mapRegion]);

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

    const renderMap = (isFullScreenMap: boolean) => (
      <MapView
        ref={isFullScreenMap ? fullScreenMapRef : mapRef}
        style={isFullScreenMap ? styles.fullScreenMap : styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={mapRegion}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={isFullScreenMap}
        pitchEnabled={isFullScreenMap}
        rotateEnabled={isFullScreenMap}
        zoomEnabled
        scrollEnabled={isFullScreenMap}>
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
    );

    const renderLegend = () => (
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>1-2</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
          <Text style={styles.legendText}>3-4</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>5-9</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF5722' }]} />
          <Text style={styles.legendText}>10+</Text>
        </View>
      </View>
    );

    return (
      <>
        <TouchableOpacity
          style={[styles.container, { height }]}
          onPress={handleOpenFullScreen}
          activeOpacity={0.9}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>📍 Your Boba Map</Text>
            <Text style={styles.expandHint}>Tap to expand</Text>
          </View>
          <View style={styles.mapContainer}>{renderMap(false)}</View>
          {renderLegend()}
        </TouchableOpacity>

        <Modal
          visible={isFullScreen}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleCloseFullScreen}>
          <SafeAreaView style={styles.fullScreenContainer}>
            <StatusBar barStyle="dark-content" />

            {/* Full Screen Map */}
            <View style={styles.fullScreenMapContainer}>{renderMap(true)}</View>

            {/* Header */}
            <View style={styles.fullScreenHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseFullScreen}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.fullScreenTitle}>Your Boba Map</Text>
              <View style={styles.headerPlaceholder} />
            </View>

            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity
                style={[styles.controlButton, isLocating && styles.controlButtonDisabled]}
                onPress={handleGoToCurrentLocation}
                disabled={isLocating}>
                <Text style={styles.controlButtonText}>{isLocating ? '⏳' : '📍'}</Text>
                <Text style={styles.controlButtonLabel}>My Location</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={handleFitAllMarkers}>
                <Text style={styles.controlButtonText}>🗺️</Text>
                <Text style={styles.controlButtonLabel}>Fit All</Text>
              </TouchableOpacity>
            </View>

            {/* Legend */}
            <View style={styles.fullScreenLegend}>
              <Text style={styles.legendTitle}>Visit frequency:</Text>
              {renderLegend()}
            </View>
          </SafeAreaView>
        </Modal>
      </>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text.accent,
  },
  expandHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.light,
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
  // Full Screen Styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fullScreenHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  fullScreenTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text.accent,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  headerPlaceholder: {
    width: 40,
  },
  fullScreenMapContainer: {
    flex: 1,
  },
  fullScreenMap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  mapControls: {
    position: 'absolute',
    bottom: 120,
    right: SPACING.lg,
    gap: SPACING.sm,
  },
  controlButton: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    minWidth: 80,
    ...SHADOWS.md,
  },
  controlButtonDisabled: {
    opacity: 0.6,
  },
  controlButtonText: {
    fontSize: FONT_SIZES.xxl,
  },
  controlButtonLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  fullScreenLegend: {
    position: 'absolute',
    bottom: 40,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  legendTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
});

export default VisitedLocationsMap;
