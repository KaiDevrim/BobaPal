import React, { useState, useCallback } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import database from '../database/index.native';
import Drink from '../database/model/Drink';

interface DrinkForm {
  flavor: string;
  price: string;
  store: string;
  occasion: string;
  rating: number | null;
  image: string | null;
}

const INITIAL_FORM: DrinkForm = {
  flavor: '',
  price: '',
  store: '',
  occasion: '',
  rating: null,
  image: null,
};

const RATINGS = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😊' },
];

const DEFAULT_IMAGE = require('../assets/boba.jpg');

const AddDrink: React.FC = () => {
  const [form, setForm] = useState<DrinkForm>(INITIAL_FORM);

  const updateField = useCallback(<K extends keyof DrinkForm>(field: K, value: DrinkForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = (): string | null => {
    if (!form.flavor.trim()) return 'Please enter a flavor';
    const numericPrice = parseFloat(form.price);
    if (isNaN(numericPrice) || numericPrice <= 0) return 'Please enter a valid price';
    if (!form.store.trim()) return 'Please enter store';
    if (!form.occasion.trim()) return 'Please enter occasion';
    if (form.rating === null) return 'Please select a rating';
    if (!form.image) return 'Please select an image';
    return null;
  };

  const saveDrink = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      await database.write(async () => {
        await database.collections.get<Drink>('drinks').create((drink) => {
          drink.flavor = form.flavor.trim();
          drink.price = parseFloat(form.price);
          drink.store = form.store.trim();
          drink.occasion = form.occasion.trim();
          drink.rating = form.rating!;
          drink.date = new Date().toISOString().slice(0, 10);
          drink.photoUrl = form.image!;
        });
      });
      Alert.alert('Success', 'Drink saved!');
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error('Failed to save drink:', error);
      Alert.alert('Error', 'Failed to save drink');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      updateField('image', result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      updateField('image', result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={form.image ? { uri: form.image } : DEFAULT_IMAGE}
        style={styles.imagePlaceholder}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
          <Text style={styles.secondaryButtonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
          <Text style={styles.primaryButtonText}>Choose Photo</Text>
        </TouchableOpacity>
      </View>

      <FormField
        label="Flavor"
        placeholder="e.g. Strawberry Matcha Latte"
        value={form.flavor}
        onChangeText={(text) => updateField('flavor', text)}
      />

      <FormField
        label="Price"
        placeholder="e.g. 5.99"
        value={form.price}
        onChangeText={(text) => {
          if (/^\d*\.?\d*$/.test(text)) updateField('price', text);
        }}
        keyboardType="numeric"
      />

      <FormField
        label="Store"
        placeholder="e.g. Tsaocaa"
        value={form.store}
        onChangeText={(text) => updateField('store', text)}
      />

      <FormField
        label="What is the occasion?"
        placeholder="e.g. Celebrating that I passed my exam!"
        value={form.occasion}
        onChangeText={(text) => updateField('occasion', text)}
      />

      <Text style={styles.label}>Rating</Text>
      <View style={styles.ratingContainer}>
        {RATINGS.map(({ value, emoji }) => (
          <TouchableOpacity
            key={value}
            onPress={() => updateField('rating', value)}
            style={[styles.emojiButton, form.rating === value && styles.selectedEmojiButton]}>
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={saveDrink}>
        <Text style={styles.submitButtonText}>Log My Boba!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
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
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
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
    marginTop: 8,
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
    padding: 8,
    borderRadius: 12,
  },
  emoji: {
    fontSize: 32,
  },
  selectedEmojiButton: {
    backgroundColor: '#4A90E2',
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
});

export default AddDrink;
