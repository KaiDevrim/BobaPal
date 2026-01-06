import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import { signInWithRedirect, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';

import { configureAmplify } from './src/config/amplify';
import { RootStackParamList, TabParamList } from './src/types/navigation';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from './src/constants/theme';
import database from './database/index.native';
import { BottomBar } from './components';
import Gallery from './pages/Gallery';
import AddDrink from './pages/AddDrink';
import Stats from './pages/Stats';
import DrinkDetail from './pages/DrinkDetail';
import EditDrink from './pages/EditDrink';
import { syncFromCloud } from './services/syncService';
// TODO: Add app icon to the sign in page at the top
// TODO: Go through whole app and remove console.logs and add proper error handling and remove in-dev stuff
// Log app startup
console.log('[App] Starting BobaPal...');

// Initialize Amplify before any components render
try {
  configureAmplify();
  console.log('[App] Amplify configured successfully');
} catch (error) {
  console.error('[App] Failed to configure Amplify:', error);
}

// Validate that all page components are loaded
if (!Gallery || !AddDrink || !Stats || !DrinkDetail || !EditDrink) {
  console.error('Missing page components:', { Gallery, AddDrink, Stats, DrinkDetail, EditDrink });
} else {
  console.log('[App] All page components loaded successfully');
}

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
MainTabs.displayName = 'MainTabs';

const AuthenticatedApp: React.FC = () => {
  useEffect(() => {
    syncFromCloud().catch((error) => {
      if (__DEV__) {
        console.error('Sync error:', error);
      }
    });
  }, []);

  return (
    <DatabaseProvider database={database}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="DrinkDetail" component={DrinkDetail} />
            <Stack.Screen name="EditDrink" component={EditDrink} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </DatabaseProvider>
  );
};
AuthenticatedApp.displayName = 'AuthenticatedApp';

const CustomSignIn: React.FC = () => {
  const handleGoogleSignIn = () => {
    signInWithRedirect({ provider: 'Google' });
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>🧋 BobaPal</Text>
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
CustomSignIn.displayName = 'CustomSignIn';

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

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

const useAuthStatus = (): AuthStatus => {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        console.log('[Auth] Checking current user...');
        const user = await getCurrentUser();
        console.log('[Auth] User found:', user?.userId);
        if (isMounted) {
          setStatus('authenticated');
        }
      } catch (error) {
        console.log('[Auth] No user found, showing sign in');
        if (isMounted) {
          setStatus('unauthenticated');
        }
      }
    };

    // Add a timeout to prevent hanging on the loading screen
    const timeoutId = setTimeout(() => {
      console.log('[Auth] Auth check timed out, defaulting to unauthenticated');
      if (isMounted) {
        setStatus((current) => current === 'loading' ? 'unauthenticated' : current);
      }
    }, 5000);

    checkAuth();

    const listener = Hub.listen('auth', ({ payload }) => {
      console.log('[Auth] Hub event:', payload.event);
      if (payload.event === 'signedIn' || payload.event === 'signInWithRedirect') {
        if (isMounted) setStatus('authenticated');
      }
      if (payload.event === 'signedOut') {
        if (isMounted) setStatus('unauthenticated');
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      listener();
    };
  }, []);

  return status;
};

const App: React.FC = () => {
  const authStatus = useAuthStatus();

  console.log('[App] Current auth status:', authStatus);

  if (authStatus === 'loading') {
    return (
      <View style={[authStyles.container, { backgroundColor: '#FFF8F0' }]}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={[authStyles.subtitle, { color: '#666666', marginTop: 20 }]}>Loading...</Text>
      </View>
    );
  }

  if (authStatus === 'authenticated') {
    return <AuthenticatedApp />;
  }

  return <CustomSignIn />;
};
App.displayName = 'App';

export default App;
