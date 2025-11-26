import React, { useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import database from '../database/index.native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Drink from '../database/model/Drink';
import { useFocusEffect } from '@react-navigation/native';

const Stats = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const fetchDrinks = async () => {
    try {
      const drinksCollection = database.collections.get<Drink>('drinks');
      const allDrinks = await drinksCollection.query().fetch();
      setDrinks(allDrinks);
    } catch (error) {
      console.error('Failed to fetch drinks:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDrinks();
    }, [])
  );

  let drinkCount = 0;
  let uniqueStores: string[] = [];
  let storeCount = 0;
  let totalSpent = 0;
  let storesVisited: Map<string, number> = new Map();

  for (let drink of drinks) {
    drinkCount++;
    if (!uniqueStores.includes(drink.store)) {
      uniqueStores.push(drink.store);
      storeCount++;
    }
    totalSpent += drink.price;
    storesVisited.set(drink.store, (storesVisited.get(drink.store) || 0) + 1);
  }

  // Sort descending by visits
  let sortedStores = new Map(
    [...storesVisited.entries()].sort((a, b) => b[1] - a[1])
  );

  // Get top 3 entries
  const top3Stores = [...sortedStores.entries()].slice(0, 3);

  // @ts-ignore
  const StatsCard = ({ icon, number, label }) => {
    return (
      <SafeAreaView style={styles.cardContainer}>
        <SafeAreaView style={styles.card}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.number}>{number}</Text>
          <Text style={styles.label}>{label}</Text>
        </SafeAreaView>
      </SafeAreaView>
    );
  };

  const StatsRow = () => {
    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.cardsRow}>
          <StatsCard icon="☕" number={drinkCount} label="DRINKS" />
          <StatsCard icon="🛒" number={storeCount} label="STORES" />
        </SafeAreaView>
      </SafeAreaView>
    );
  };

  if (drinkCount === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Boba stats</Text>
        <Text>Add more boba to see your stats</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatsRow />
      {/*<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Boba stats</Text>*/}
      {/*<Text>You have had a total of: {drinkCount}</Text>*/}
      {/*<Text>You have been to: {storeCount} stores</Text>*/}
      {/*<Text>You have spent: ${totalSpent.toFixed(2)}</Text>*/}
      {/*<Text>*/}
      {/*  Your average boba price is:{' '}*/}
      {/*  {drinkCount > 0 ? `$${(totalSpent / drinkCount).toFixed(2)}` : 'N/A'}*/}
      {/*</Text>*/}
      {/*<Text>Your top 3 stores are:</Text>*/}
      {/*{top3Stores.map(([store, count], index) => (*/}
      {/*  <Text key={index}>*/}
      {/*    {store} ({count} visit{count > 1 ? 's' : ''})*/}
      {/*  </Text>*/}
      {/*))}*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: -500
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    paddingBottom: 200
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#F5EDE4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D2317',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#3D2317',
    paddingTop: -40
  },
  icon: {
    fontSize: 32,
  },
  number: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2317',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D2317',
    letterSpacing: 1,
  }
});

export default Stats;
