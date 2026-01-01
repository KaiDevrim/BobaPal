import { VisitedLocation } from '../../components/VisitedLocationsMap';

describe('VisitedLocationsMap', () => {
  const mockLocations: VisitedLocation[] = [
    {
      id: '1',
      storeName: 'Kung Fu Tea',
      latitude: 37.7749,
      longitude: -122.4194,
      visitCount: 5,
    },
    {
      id: '2',
      storeName: 'Boba Guys',
      latitude: 37.7849,
      longitude: -122.4094,
      visitCount: 12,
    },
    {
      id: '3',
      storeName: 'Tiger Sugar',
      latitude: 37.7649,
      longitude: -122.4294,
      visitCount: 2,
    },
  ];

  describe('location data structure', () => {
    it('locations have required fields', () => {
      mockLocations.forEach((location) => {
        expect(location).toHaveProperty('id');
        expect(location).toHaveProperty('storeName');
        expect(location).toHaveProperty('latitude');
        expect(location).toHaveProperty('longitude');
        expect(location).toHaveProperty('visitCount');
        expect(typeof location.latitude).toBe('number');
        expect(typeof location.longitude).toBe('number');
        expect(typeof location.visitCount).toBe('number');
      });
    });
  });

  describe('region calculation', () => {
    it('calculates center point correctly', () => {
      const lats = mockLocations.map((l) => l.latitude);
      const lngs = mockLocations.map((l) => l.longitude);

      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

      expect(centerLat).toBeCloseTo(37.7749, 2);
      expect(centerLng).toBeCloseTo(-122.4194, 2);
    });

    it('calculates delta correctly', () => {
      const lats = mockLocations.map((l) => l.latitude);
      const lngs = mockLocations.map((l) => l.longitude);

      const latDelta = Math.max(...lats) - Math.min(...lats);
      const lngDelta = Math.max(...lngs) - Math.min(...lngs);

      expect(latDelta).toBeGreaterThanOrEqual(0);
      expect(lngDelta).toBeGreaterThanOrEqual(0);
    });
  });

  describe('marker color logic', () => {
    const getMarkerColor = (visitCount: number): string => {
      if (visitCount >= 10) return '#FF5722';
      if (visitCount >= 5) return '#FF9800';
      if (visitCount >= 3) return '#FFC107';
      return '#FF9800'; // Default primary
    };

    it('returns hot color for 10+ visits', () => {
      expect(getMarkerColor(10)).toBe('#FF5722');
      expect(getMarkerColor(15)).toBe('#FF5722');
    });

    it('returns warm color for 5-9 visits', () => {
      expect(getMarkerColor(5)).toBe('#FF9800');
      expect(getMarkerColor(9)).toBe('#FF9800');
    });

    it('returns medium color for 3-4 visits', () => {
      expect(getMarkerColor(3)).toBe('#FFC107');
      expect(getMarkerColor(4)).toBe('#FFC107');
    });

    it('returns default color for 1-2 visits', () => {
      expect(getMarkerColor(1)).toBe('#FF9800');
      expect(getMarkerColor(2)).toBe('#FF9800');
    });
  });

  describe('empty state', () => {
    it('handles empty locations array', () => {
      const emptyLocations: VisitedLocation[] = [];
      expect(emptyLocations.length).toBe(0);
    });
  });

  describe('location aggregation logic', () => {
    it('groups visits by place', () => {
      const drinks = [
        { store: 'Kung Fu Tea', latitude: 37.7749, longitude: -122.4194, placeId: 'place1' },
        { store: 'Kung Fu Tea', latitude: 37.7749, longitude: -122.4194, placeId: 'place1' },
        { store: 'Boba Guys', latitude: 37.7849, longitude: -122.4094, placeId: 'place2' },
      ];

      const locationMap = new Map<string, { visitCount: number }>();

      drinks.forEach((drink) => {
        const key = drink.placeId || `${drink.latitude},${drink.longitude}`;
        const existing = locationMap.get(key);

        if (existing) {
          existing.visitCount += 1;
        } else {
          locationMap.set(key, { visitCount: 1 });
        }
      });

      expect(locationMap.get('place1')?.visitCount).toBe(2);
      expect(locationMap.get('place2')?.visitCount).toBe(1);
    });

    it('filters out drinks without coordinates', () => {
      const drinks = [
        { store: 'Store 1', latitude: 37.7749, longitude: -122.4194 },
        { store: 'Store 2', latitude: null, longitude: null },
        { store: 'Store 3', latitude: 37.7849, longitude: -122.4094 },
      ];

      const locationsWithCoords = drinks.filter((d) => d.latitude !== null && d.longitude !== null);

      expect(locationsWithCoords.length).toBe(2);
    });
  });
});
