import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import database from '../database/index.native';
import Drink from '../database/model/Drink';
import MyDrinkCard from '../components/MyDrinkCard';
import { RootStackParamList } from '../App';

const Gallery: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

  const handleDrinkPress = useCallback(
    (drinkId: string) => {
      navigation.navigate('DrinkDetail', { drinkId });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Drink }) => (
      <TouchableOpacity onPress={() => handleDrinkPress(item.id)}>
        <MyDrinkCard title={item.flavor} date={item.date} image={item.photoUrl} />
      </TouchableOpacity>
    ),
    [handleDrinkPress]
  );

  const keyExtractor = useCallback((item: Drink) => item.id, []);

  if (drinks.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your Boba Gallery</Text>
        <Text style={styles.emptyText}>Add some boba to see your collection!</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={drinks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  row: {
    justifyContent: 'space-between',
  },
  list: {
    paddingBottom: 100,
  },
});

export default Gallery;
