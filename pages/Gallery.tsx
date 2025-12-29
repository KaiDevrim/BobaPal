import React, { useCallback, useState, memo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import database from '../database/index.native';
import Drink from '../database/model/Drink';
import { MyDrinkCard, EmptyState } from '../components';
import { RootStackParamList } from '../src/types/navigation';
import { SPACING } from '../src/constants/theme';

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
      <TouchableOpacity onPress={() => handleDrinkPress(item.id)} activeOpacity={0.8}>
        <MyDrinkCard title={item.flavor} date={item.date} s3Key={item.s3Key} />
      </TouchableOpacity>
    ),
    [handleDrinkPress]
  );

  const keyExtractor = useCallback((item: Drink) => item.id, []);

  if (drinks.length === 0) {
    return <EmptyState title="Your Boba Gallery" message="Add some boba to see your collection!" />;
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
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: 50,
  },
  row: {
    justifyContent: 'space-between',
  },
  list: {
    paddingBottom: 100,
  },
});

export default memo(Gallery);
