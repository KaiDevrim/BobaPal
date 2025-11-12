import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import database from '../database/index.native';
import Drink from '../database/model/Drink';

// @ts-ignore
const DrinkDetail = ({ route }) => {
  const { drinkId } = route.params;
  const [drink, setDrink] = useState<Drink | null>(null);

  useEffect(() => {
    const fetchDrink = async () => {
      const drinkItem = await database.collections.get<Drink>('drinks').find(drinkId);
      setDrink(drinkItem);
    };
    fetchDrink().then(r => r);
  }, [drinkId]);

  if (!drink) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Image Placeholder */}
      <Image source={require('../assets/boba.jpg')} style={styles.imagePlaceholder} />

      {/* Photo Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Choose Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Flavor Input */}
      <Text style={styles.label}>Flavor</Text>
      <Text style={styles.input}>{drink.flavor}</Text>

      {/* Price Input */}
      <Text style={styles.label}>Price</Text>
      <Text style={styles.input}>{drink.price}</Text>

      {/* Store Input */}
      <Text style={styles.label}>Store</Text>
      <Text style={styles.input}>{drink.store}</Text>

      {/* Occasion Input */}
      <Text style={styles.label}>Occasion</Text>
      <Text style={styles.input}>{drink.occasion}</Text>

      {/* Rating */}
      <Text style={styles.label}>Rating</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#ccc',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 0,
    marginTop: 0,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: 'white',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 15,
  },
  emojiButton: {
    padding: 5,
  },
  emoji: {
    fontSize: 32,
  },
});
export default DrinkDetail;
