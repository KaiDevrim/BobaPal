import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useS3Image } from '../hooks/useS3Image';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';

interface MyDrinkCardProps {
  title: string;
  date: string;
  s3Key: string | null;
}

// Placeholder blur hash for boba-colored loading state
const PLACEHOLDER_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0LMD%s:';

const MyDrinkCard: React.FC<MyDrinkCardProps> = memo(({ title, date, s3Key }) => {
  const { imageUrl, loading } = useS3Image(s3Key);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../assets/boba.jpg')}
          style={styles.image}
          placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
          contentFit="cover"
          transition={200}
          cachePolicy="disk"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
});

MyDrinkCard.displayName = 'MyDrinkCard';

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    ...SHADOWS.md,
    margin: SPACING.sm,
  },
  imageContainer: {
    width: '100%',
    height: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: SPACING.md,
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
  },
});

export default MyDrinkCard;
