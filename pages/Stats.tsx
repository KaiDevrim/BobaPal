import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import database from '../database/index.native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stats = () => {
  const [totalDrinks, setTotalDrinks] = useState(0);
  useEffect(() => {
    const fetchCount = async () => {
      const count = await database.collections.get('drinks').query().fetchCount();
      setTotalDrinks(count);
    };
    fetchCount().then(r => r);
  }, []);
  // we need:
  // total drinks - DONE
  // total stores
  // total unique flavours
  // total spent
  // average price
  // top 3 stores
  // top flavour

  return (
    <SafeAreaView style={styles.container}>
      <Text className="text-xl font-bold">Your Boba stats</Text>
      <Text>You have had a total of: {totalDrinks}</Text>
    </SafeAreaView>
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
  });

export default Stats;