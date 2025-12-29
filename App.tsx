import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react-native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { configureAmplify } from './src/config/amplify';
import { RootStackParamList, TabParamList } from './src/types/navigation';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from './src/constants/theme';
import database from './database/index.native';
import { BottomBar } from './components';
import Gallery from './pages/Gallery';
import AddDrink from './pages/AddDrink';
import Stats from './pages/Stats';
import DrinkDetail from './pages/DrinkDetail';
import { syncFromCloud } from './services/syncService';
import { useCurrentUser } from './hooks/useCurrentUser';

// Initialize Amplify before any components render
configureAmplify();

// Re-export types for backward compatibility
export type { RootStackParamList, TabParamList };

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

const AuthenticatedApp: React.FC = () => {
  const { user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      syncFromCloud().catch(console.error);
    }
  }, [user]);

  return (
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
};

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
    backgroundColor: COLORS.backgroundAlt,
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text.accent,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: SPACING.md,
  },
  googleButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
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
