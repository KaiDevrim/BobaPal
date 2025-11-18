import React, { useEffect, useState } from 'react';
import BottomBar from './components/BottomBar';
import { NavigationContainer } from '@react-navigation/native';
import Gallery from './pages/Gallery';
import AddDrink from './pages/AddDrink';
import Stats from './pages/Stats';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import database from './database/index.native';
import { createStackNavigator } from '@react-navigation/stack';
import DrinkDetail from './pages/DrinkDetail';

const TABS = {
  Gallery: Gallery,
  AddDrink: AddDrink,
  Stats: Stats,
};
const Stack = createStackNavigator();
export default function App() {
  return (
    <DatabaseProvider database={database}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Gallery" component={MainTabs} />
              <Stack.Screen name="DrinkDetail" component={DrinkDetail} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}


// @ts-ignore
function MainTabs({ navigation }) {
  const [currentTab, setCurrentTab] = useState('Gallery');

  // @ts-ignore
  const ActiveTabComponent = TABS[currentTab];
  useEffect(() => {
    navigation.setOptions({ title: currentTab });
  }, [currentTab, navigation]);
  // Pass the navigation prop down so you can navigate to DrinkDetail etc. from any page
  return (
    <View style={styles.container}>
      <ActiveTabComponent navigation={navigation} />
      <BottomBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -50,
  },
});
