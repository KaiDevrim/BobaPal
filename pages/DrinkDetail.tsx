import React, { useEffect, useState, memo } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import database from '../database/index.native';
import Drink from '../database/model/Drink';
import { RootStackParamList } from '../src/types/navigation';
import { useS3Image } from '../hooks/useS3Image';
import { LoadingState, DetailRow } from '../components';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';
import { RATING_EMOJIS, DEFAULT_IMAGES } from '../src/constants';

const DrinkDetail: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DrinkDetail'>>();
  const { drinkId } = route.params;
  const [drink, setDrink] = useState<Drink | null>(null);
  const [loading, setLoading] = useState(true);

  const { imageUrl, loading: imageLoading } = useS3Image(drink?.s3Key ?? null);

  useEffect(() => {
    const fetchDrink = async () => {
      try {
        const drinkItem = await database.collections.get<Drink>('drinks').find(drinkId);
        setDrink(drinkItem);
      } catch (error) {
        console.error('Failed to fetch drink:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrink();
  }, [drinkId]);

  if (loading) {
    return <LoadingState />;
  }

  if (!drink) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Drink not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {imageLoading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Image
            source={imageUrl ? { uri: imageUrl } : DEFAULT_IMAGES.boba2}
            style={styles.image}
          />
        )}
      </View>

      <DetailRow label="Flavor" value={drink.flavor} />
      <DetailRow label="Price" value={`$${drink.price.toFixed(2)}`} />
      <DetailRow label="Store" value={drink.store} />
      <DetailRow label="Occasion" value={drink.occasion} />
      <DetailRow label="Date" value={drink.date} />

      <Text style={styles.label}>Rating</Text>
      <Text style={styles.ratingEmoji}>{RATING_EMOJIS[drink.rating] || '—'}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#f5f5f5',
    marginBottom: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.full,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  ratingEmoji: {
    fontSize: FONT_SIZES.title,
    marginTop: SPACING.sm,
  },
});

export default memo(DrinkDetail);
