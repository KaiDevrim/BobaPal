import React, { useCallback, useMemo, useState, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import database from '../database/index.native';
import Drink from '../database/model/Drink';
import { StatsCard, EmptyState } from '../components';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';
import type { StatsData } from '../src/types';

const Stats: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const fetchDrinks = useCallback(async () => {
    try {
      const allDrinks = await database.collections.get<Drink>('drinks').query().fetch();
      setDrinks(allDrinks);
    } catch (error) {
      console.error('Failed to fetch drinks:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDrinks();
    }, [fetchDrinks])
  );

  const stats: StatsData = useMemo(() => {
    const storeVisits = new Map<string, number>();
    let totalSpent = 0;

    drinks.forEach((drink) => {
      totalSpent += drink.price;
      storeVisits.set(drink.store, (storeVisits.get(drink.store) || 0) + 1);
    });

    const topStores = [...storeVisits.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

    return {
      drinkCount: drinks.length,
      storeCount: storeVisits.size,
      totalSpent,
      topStores,
    };
  }, [drinks]);

  if (stats.drinkCount === 0) {
    return <EmptyState title="Your Boba Stats" message="Add more boba to see your stats" />;
  }

  const averagePrice = stats.totalSpent / stats.drinkCount;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Boba Stats</Text>

      <View style={styles.cardsRow}>
        <StatsCard icon="🧋" number={stats.drinkCount} label="DRINKS" />
        <StatsCard icon="🏪" number={stats.storeCount} label="STORES" />
      </View>

      <View style={styles.cardsRow}>
        <StatsCard icon="💰" number={`$${stats.totalSpent.toFixed(0)}`} label="SPENT" />
        <StatsCard icon="📊" number={`$${averagePrice.toFixed(2)}`} label="AVG PRICE" />
      </View>

      {stats.topStores.length > 0 && (
        <View style={styles.topStoresContainer}>
          <Text style={styles.sectionTitle}>Top Stores</Text>
          {stats.topStores.map(([store, count], index) => (
            <Text key={store} style={styles.storeText}>
              {index + 1}. {store} ({count} visit{count > 1 ? 's' : ''})
            </Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: COLORS.text.accent,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  topStoresContainer: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.text.accent,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text.accent,
    marginBottom: SPACING.sm,
  },
  storeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.accent,
    marginBottom: SPACING.xs,
  },
});

export default memo(Stats);
