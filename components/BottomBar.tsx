import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

// @ts-ignore
export default function BottomBar({ currentTab, setCurrentTab }) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={() => setCurrentTab('Gallery')}>
        <View style={styles.tabItem}>
          <AntDesign style={styles.icon} name="home" size={22} color={currentTab === 'Gallery' ? 'orange' : 'white'} />
          <Text style={{ color: currentTab === 'Gallery' ? 'orange' : 'white' }} className="text-sm" >Home</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentTab('AddDrink')}>
        <View style={styles.tabItem}>
          <AntDesign style={styles.icon} name="plus-circle" size={22} color={currentTab === 'AddDrink' ? 'orange' : 'white'} />
          <Text style={{ color: currentTab === 'AddDrink' ? 'orange' : 'white' }}>Add Boba</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentTab('Stats')}>
        <View style={styles.tabItem}>
          <AntDesign style={styles.icon} name="line-chart" size={22} color={currentTab === 'Stats' ? 'orange' : 'white'} />
          <Text style={{ color: currentTab === 'Stats' ? 'orange' : 'white' }}>Stats</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    fontSize: 16,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: "#583B39",
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
    fontSize: 16,
    display: 'flex',
    marginHorizontal: 32,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    paddingVertical: 10,
  }
});