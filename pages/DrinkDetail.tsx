import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import database from '../database/index.native';
import Drink from '../database/model/Drink';
import { RootStackParamList } from '../App';

const RATINGS: Record<number, string> = {
  1: '😞',
  2: '😐',
  3: '🙂',
  4: '😊',
};

const DEFAULT_IMAGE = require('../assets/boba2.jpg');

const DrinkDetail: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DrinkDetail'>>();
  const { drinkId } = route.params;
  const [drink, setDrink] = useState<Drink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrink = async () => {
      try {
        const drinkItem = await database.collections.get<Drink>('drinks').find(drinkId);
        setDrink(drinkItem);
      } catch (error) {
        console.error('Failed to fetch drink:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrink();
  }, [drinkId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </SafeAreaView>
    );
  }

  if (!drink) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Drink not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={drink.photoUrl ? { uri: drink.photoUrl } : DEFAULT_IMAGE}
        style={styles.image}
      />

      <DetailRow label="Flavor" value={drink.flavor} />
      <DetailRow label="Price" value={`$${drink.price.toFixed(2)}`} />
      <DetailRow label="Store" value={drink.store} />
      <DetailRow label="Occasion" value={drink.occasion} />
      <DetailRow label="Date" value={drink.date} />

      <Text style={styles.label}>Rating</Text>
      <Text style={styles.ratingEmoji}>{RATINGS[drink.rating] || '—'}</Text>
    </SafeAreaView>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  value: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    color: '#333',
  },
  ratingEmoji: {
    fontSize: 48,
    marginTop: 10,
  },
});

export default DrinkDetail;
