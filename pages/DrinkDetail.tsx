import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import database from '../database/index.native';

// @ts-ignore
const DrinkDetail = ({ route }) => {
  const { drinkId } = route.params;
  const [drink, setDrink] = useState(null);

  useEffect(() => {
    const fetchDrink = async () => {
      const drinkItem = await database.collections.get('drinks').find(drinkId);
      // @ts-ignore
      setDrink(drinkItem);
    };
    fetchDrink();
  }, [drinkId]);

  if (!drink) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{drink.date}</Text>
      <Text style={styles.title}>{drink.flavor}</Text>
      <Text style={styles.price}>${drink.price}</Text>
      <Text style={styles.store}>{drink.store}</Text>
      <Text style={styles.occasion}>{drink.occasion}</Text>
      <Text style={styles.rating}>Rating: {drink.rating}</Text>
      {/* Add other fields and images if you want */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  date: { fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  price: { fontSize: 18 },
  store: { fontSize: 18 },
  occasion: { fontSize: 16 },
  rating: { fontSize: 18 },
});
export default DrinkDetail;
