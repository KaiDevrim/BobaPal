import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import database from '../database/index.native';
import Drink from '../database/model/Drink';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker';

const AddDrink = () => {
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [priceText, setPriceText] = useState<string>('');
  const [store, setStore] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [rating, setSelectedRating] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const saveDrink = async () => {
    if (!flavorText) {
      alert('Please enter a flavor');
      return;
    }
    const numericPrice = parseFloat(priceText);
    if (isNaN(numericPrice)) {
      alert('Please enter a valid price');
      return;
    }

    if (!store) {
      alert('Please enter store');
      return;
    }
    if (!occasion) {
      alert('Please enter occasion');
      return;
    }
    if (rating === null) {
      alert('Please select a rating');
      return;
    }
    if (!image) {
      alert('Please enter a image');
      return;
    }

    try {
      await database.write(async () => {
        const currentDate = new Date().toISOString().slice(0, 10);
        await database.collections.get<Drink>('drinks').create(drink => {
          drink.flavor = flavorText;
          drink.price = numericPrice;
          drink.store = store;
          drink.occasion = occasion;
          drink.rating = rating;
          drink.date = currentDate;
          drink.photoUrl = image;
        });
      });
      alert('Drink saved!');
      // Reset fields after save
      setFlavorText('');
      setPriceText('')
      setPrice(null);
      setStore('');
      setOccasion('');
      setSelectedRating(null);
      setImage(null);
    } catch (error) {
      console.error('Failed to save drink:', error);
      alert('Failed to save drink');
    }
  };

  const pickImage = async () => {
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Image Placeholder */}

      <Image
        source={image ? { uri: image } : require("../assets/boba.jpg")}
        style={styles.imagePlaceholder}
      />

      {/* Photo Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
          <Text style={styles.primaryButtonText}>Choose Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Flavor Input */}
      <Text style={styles.label}>Flavor</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Strawberry Matcha Latte"
        placeholderTextColor="#999"
        onChangeText={setFlavorText}
        value={flavorText || ''}
      />

      {/* Price Input */}
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. $00.00"
        placeholderTextColor="#999"
        keyboardType="numeric"
        onChangeText={text => {
          // Allow only digits and decimal point, basic validation
          if (/^\d*\.?\d*$/.test(text)) {
            setPriceText(text);
          }
        }}
        value={priceText}
      />

      {/* Store Input */}
      <Text style={styles.label}>Store</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Tsaocaa"
        placeholderTextColor="#999"
        onChangeText={setStore}
        value={store || ''}
      />

      {/* Occasion Input */}
      <Text style={styles.label}>What is the occasion?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Celebrating that I passed my exam!"
        placeholderTextColor="#999"
        onChangeText={setOccasion}
        value={occasion || ''}
      />

      {/* Rating */}
      <Text style={styles.label}>Rating</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4].map(value => (
          <TouchableOpacity
            key={value}
            onPress={() => setSelectedRating(value)}
            style={[
              styles.emojiButton,
              rating === value && styles.selectedEmojiButton,  // conditional style
            ]}
          >
            <Text style={styles.emoji}>
              {value === 1 && '😞'}
              {value === 2 && '😐'}
              {value === 3 && '🙂'}
              {value === 4 && '😊'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={saveDrink}>
        <Text style={styles.submitButtonText}>Log My Boba!</Text>
      </TouchableOpacity>
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
  submitButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedEmojiButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 5,
  }
});

export default AddDrink;
