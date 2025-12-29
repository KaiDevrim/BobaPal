// Mock for react-native
const React = require('react');

const View = 'View';
const Text = 'Text';
const TouchableOpacity = 'TouchableOpacity';
const TextInput = 'TextInput';
const Image = 'Image';
const ScrollView = 'ScrollView';
const FlatList = 'FlatList';
const ActivityIndicator = 'ActivityIndicator';
const Alert = {
  alert: jest.fn(),
};

const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => style,
};

const Platform = {
  OS: 'ios',
  select: (obj) => obj.ios || obj.default,
};

const Dimensions = {
  get: () => ({ width: 375, height: 812 }),
};

module.exports = {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
  Dimensions,
};
