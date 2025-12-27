import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import database from '../database/index.native';
import Drink from '../database/model/Drink';

interface StatsData {
  drinkCount: number;
  storeCount: number;
  totalSpent: number;
  topStores: [string, number][];
}

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
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your Boba Stats</Text>
        <Text style={styles.emptyText}>Add more boba to see your stats</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Boba Stats</Text>

      <View style={styles.cardsRow}>
        <StatsCard icon="🧋" number={stats.drinkCount} label="DRINKS" />
        <StatsCard icon="🏪" number={stats.storeCount} label="STORES" />
      </View>

      <View style={styles.cardsRow}>
        <StatsCard icon="💰" number={`$${stats.totalSpent.toFixed(0)}`} label="SPENT" />
        <StatsCard
          icon="📊"
          number={`$${(stats.totalSpent / stats.drinkCount).toFixed(2)}`}
          label="AVG PRICE"
        />
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

interface StatsCardProps {
  icon: string;
  number: number | string;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, number, label }) => (
  <View style={styles.card}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3D2317',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#F5EDE4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 3,
    borderColor: '#3D2317',
    shadowColor: '#3D2317',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  number: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2317',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3D2317',
    letterSpacing: 1,
  },
  topStoresContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5EDE4',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3D2317',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D2317',
    marginBottom: 10,
  },
  storeText: {
    fontSize: 16,
    color: '#3D2317',
    marginBottom: 5,
  },
});

export default Stats;
