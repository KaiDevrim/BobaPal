import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type TabConfig = {
  name: string;
  icon: keyof typeof AntDesign.glyphMap;
  label: string;
};

const TABS: TabConfig[] = [
  { name: 'Gallery', icon: 'home', label: 'Home' },
  { name: 'AddDrink', icon: 'plus-circle', label: 'Add Boba' },
  { name: 'Stats', icon: 'line-chart', label: 'Stats' },
];

const BottomBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const currentTab = state.routes[state.index].name;

  return (
    <View style={styles.bottomBar}>
      {TABS.map((tab) => {
        const isActive = currentTab === tab.name;
        const color = isActive ? '#FF9800' : 'white';

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={styles.tabItem}>
            <AntDesign name={tab.icon} size={22} color={color} style={styles.icon} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: '#583B39',
    borderRadius: 20,
    height: 70,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
});

export default BottomBar;
