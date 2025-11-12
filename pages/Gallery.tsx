import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MyDrinkCard from '../components/MyDrinkCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import database from '../database/index.native';
import Drink from '../database/model/Drink';
import { StackNavigationProp } from '@react-navigation/stack';

const Gallery = () => {
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

  // Refetch when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDrinks().then(r => r);
    }, [])
  );

  // Refetch every second
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDrinks().then(r => r);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  type RootStackParamList = {
    DrinkDetail: { drinkId: string };
  };
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const renderItem = ({ item }: { item: Drink }) =>{
    return (
      <TouchableOpacity onPress={() => navigation.navigate('DrinkDetail', { drinkId: item.id })}>
        <MyDrinkCard title={item.flavor} date={item.date} />
      </TouchableOpacity>
    );
  };

  if (drinks.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No drinks have been added</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<Drink>
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
    padding: 15,
    paddingTop: 50
  },
  row: {
    justifyContent: 'space-between',
  },
  list: {
    paddingBottom: 20,
  },
});

export default Gallery;
