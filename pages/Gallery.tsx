import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import MyDrinkCard from '../components/MyDrinkCard';
import { useFocusEffect } from '@react-navigation/native';
import database from '../database/index.native';

const Gallery = () => {
  const [drinks, setDrinks] = useState<Array<{ id: string; flavor: string; date: string }>>([]);
  const fetchDrinks = async () => {
    try {
      const drinksCollection = database.collections.get('drinks');
      const allDrinks = await drinksCollection.query().fetch();
      const drinkItems = allDrinks.map(drink => ({
        id: drink.id,
        flavor: drink.flavor,
        date: drink.date,
      }));
      setDrinks(drinkItems);
    } catch (error) {
      console.error('Failed to fetch drinks:', error);
    }
  };

  // Refetch when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDrinks();
    }, [])
  );

  // Refetch every second
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDrinks();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }: { item: { id: string; flavor: string; date: string } }) => (
    <MyDrinkCard title={item.flavor} date={item.date} />
  );

  if (drinks.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No drinks have been added</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={drinks}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={item => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  list: {
    paddingBottom: 20,
  },
});

export default Gallery;
