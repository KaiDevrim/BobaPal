import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface MyDrinkCardProps {
  title: string;
  date: string;
  image: string | null;
}

const DEFAULT_IMAGE = require('../assets/boba.jpg');

const MyDrinkCard: React.FC<MyDrinkCardProps> = ({ title, date, image }) => {
  const imageSource: ImageSourcePropType = image ? { uri: image } : DEFAULT_IMAGE;

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  image: {
    width: '100%',
    height: '65%',
  },
  textContainer: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});

export default MyDrinkCard;