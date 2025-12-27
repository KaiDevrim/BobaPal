import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Amplify } from 'aws-amplify';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react-native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import amplifyConfig from './src/amplifyconfiguration.json';
import database from './database/index.native';
import BottomBar from './components/BottomBar';
import Gallery from './pages/Gallery';
import AddDrink from './pages/AddDrink';
import Stats from './pages/Stats';
import DrinkDetail from './pages/DrinkDetail';

Amplify.configure(amplifyConfig);

export type RootStackParamList = {
  MainTabs: undefined;
  DrinkDetail: { drinkId: string };
};

export type TabParamList = {
  Gallery: undefined;
  AddDrink: undefined;
  Stats: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <BottomBar {...props} />}>
    <Tab.Screen name="Gallery" component={Gallery} />
    <Tab.Screen name="AddDrink" component={AddDrink} />
    <Tab.Screen name="Stats" component={Stats} />
  </Tab.Navigator>
);

const AuthenticatedApp: React.FC = () => (
  <DatabaseProvider database={database}>
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="DrinkDetail" component={DrinkDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  </DatabaseProvider>
);

const CustomSignIn: React.FC = () => {
  const handleGoogleSignIn = () => {
    signInWithRedirect({ provider: 'Google' });
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>🧋 Buhba</Text>
      <Text style={authStyles.subtitle}>Track your boba adventures</Text>

      <TouchableOpacity style={authStyles.googleButton} onPress={handleGoogleSignIn}>
        <Image
          source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
          style={authStyles.googleIcon}
        />
        <Text style={authStyles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3D2317',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

const AppContent: React.FC = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === 'authenticated') {
    return <AuthenticatedApp />;
  }

  return <CustomSignIn />;
};

const App: React.FC = () => (
  <Authenticator.Provider>
    <AppContent />
  </Authenticator.Provider>
);

export default App;