import React, { useState, useCallback, useEffect, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { searchBobaPlaces, PlacePrediction } from '../services/placesService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';

interface StoreAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectStore?: (store: PlacePrediction) => void;
  placeholder?: string;
}

const StoreAutocomplete: React.FC<StoreAutocompleteProps> = memo(
  ({ value, onChangeText, onSelectStore, placeholder = 'e.g. Tsaocaa' }) => {
    const { location } = useLocation();
    const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    // Debounced search
    const searchPlaces = useCallback(
      async (query: string) => {
        if (query.length < 2) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        setLoading(true);
        try {
          const results = await searchBobaPlaces(query, location);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      },
      [location]
    );

    // Handle text change with debounce
    const handleTextChange = useCallback(
      (text: string) => {
        onChangeText(text);

        // Clear previous timer
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        // Set new debounce timer
        const timer = setTimeout(() => {
          searchPlaces(text);
        }, 300);

        setDebounceTimer(timer);
      },
      [onChangeText, debounceTimer, searchPlaces]
    );

    // Handle suggestion selection
    const handleSelectSuggestion = useCallback(
      (suggestion: PlacePrediction) => {
        onChangeText(suggestion.name);
        setSuggestions([]);
        setShowSuggestions(false);
        Keyboard.dismiss();

        if (onSelectStore) {
          onSelectStore(suggestion);
        }
      },
      [onChangeText, onSelectStore]
    );

    // Cleanup debounce timer
    useEffect(() => {
      return () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
      };
    }, [debounceTimer]);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Store</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text.secondary}
            onFocus={() => value.length >= 2 && setShowSuggestions(suggestions.length > 0)}
            onBlur={() => {
              // Delay hiding to allow tap on suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          {loading && (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
          )}
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.placeId}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                  activeOpacity={0.7}>
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.address && (
                      <Text style={styles.suggestionAddress} numberOfLines={1}>
                        {item.address}
                      </Text>
                    )}
                  </View>
                  {item.distance && <Text style={styles.suggestionDistance}>{item.distance}</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
);

StoreAutocomplete.displayName = 'StoreAutocomplete';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1000,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  loader: {
    marginRight: SPACING.md,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    maxHeight: 200,
    ...SHADOWS.lg,
    zIndex: 1001,
  },
  suggestionsList: {
    borderRadius: BORDER_RADIUS.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  suggestionName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  suggestionAddress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  suggestionDistance: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
  },
});

export default StoreAutocomplete;
