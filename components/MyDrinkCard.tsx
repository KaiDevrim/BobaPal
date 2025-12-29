import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useS3Image } from '../hooks/useS3Image';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';
import { DEFAULT_IMAGES } from '../src/constants';

interface MyDrinkCardProps {
  title: string;
  date: string;
  s3Key: string | null;
}

const MyDrinkCard: React.FC<MyDrinkCardProps> = memo(({ title, date, s3Key }) => {
  const { imageUrl, loading } = useS3Image(s3Key);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Image
            source={imageUrl ? { uri: imageUrl } : DEFAULT_IMAGES.boba}
            style={styles.image}
          />
        )}
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
