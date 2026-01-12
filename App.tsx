import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { signInWithRedirect, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { configureAmplify } from './src/config/amplify';
import { RootStackParamList, TabParamList } from './src/types/navigation';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from './src/constants/theme';
import { LocalUserProvider } from './src/context/LocalUserContext';
import database from './database/index.native';
import { BottomBar } from './components';
import Gallery from './pages/Gallery';
import AddDrink from './pages/AddDrink';
import Stats from './pages/Stats';
import DrinkDetail from './pages/DrinkDetail';
import EditDrink from './pages/EditDrink';
import Profile from './pages/Profile';
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
if (!Gallery || !AddDrink || !Stats || !DrinkDetail || !EditDrink || !Profile) {
  console.error('Missing page components:', {
    Gallery,
    AddDrink,
    Stats,
    DrinkDetail,
    EditDrink,
    Profile,
  });
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

// Defensive SafeAreaProvider wrapper
const DefensiveSafeAreaProvider: React.FC<React.ComponentProps<typeof SafeAreaProvider>> = ({
  children,
  ...props
}) => {
  // Only pass valid props
  const safeProps: any = {};
  if (props.initialMetrics) safeProps.initialMetrics = props.initialMetrics;
  // Never pass style or padding props
  return <SafeAreaProvider {...safeProps}>{children}</SafeAreaProvider>;
};

// Global error boundary
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('[GlobalErrorBoundary] Caught error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <Text style={{ color: 'red', fontSize: 18, marginBottom: 10 }}>
            A fatal error occurred:
          </Text>
          <Text style={{ color: 'red', fontSize: 14 }}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const AuthenticatedApp: React.FC<{ isLocalUser: boolean }> = ({ isLocalUser }) => {
  // Defensive: catch errors in children
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLocalUser) {
      syncFromCloud().catch((error) => {
        if (__DEV__) {
          console.error('Sync error:', error);
        }
      });
    }
  }, [isLocalUser]);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text style={{ color: 'red', fontSize: 18, marginBottom: 10 }}>
          An error occurred after login:
        </Text>
        <Text style={{ color: 'red', fontSize: 14 }}>{error.message}</Text>
      </View>
    );
  }

  try {
    console.log('[AuthenticatedApp] Rendering with isLocalUser:', isLocalUser);
    return (
      <GlobalErrorBoundary>
        <LocalUserProvider>
          <DatabaseProvider database={database}>
            <DefensiveSafeAreaProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="MainTabs" component={MainTabs} />
                  <Stack.Screen name="DrinkDetail" component={DrinkDetail} />
                  <Stack.Screen name="EditDrink" component={EditDrink} />
                  <Stack.Screen name="Profile" component={Profile} />
                </Stack.Navigator>
              </NavigationContainer>
            </DefensiveSafeAreaProvider>
          </DatabaseProvider>
        </LocalUserProvider>
      </GlobalErrorBoundary>
    );
  } catch (err: any) {
    setError(err);
    return null;
  }
};
AuthenticatedApp.displayName = 'AuthenticatedApp';

const CustomSignIn: React.FC<{ onSkipLogin: () => void }> = ({ onSkipLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[Auth] Starting Google sign in...');
      await signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      console.error('[Auth] Google sign in error:', err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>🧋 BobaPal</Text>
      <Text style={authStyles.subtitle}>Track your boba adventures</Text>

      {error && <Text style={authStyles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[authStyles.googleButton, isLoading && authStyles.googleButtonDisabled]}
        onPress={handleGoogleSignIn}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.text.primary} />
        ) : (
          <>
            <Image
              source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
              style={authStyles.googleIcon}
            />
            <Text style={authStyles.googleButtonText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={authStyles.skipButton} onPress={onSkipLogin} disabled={isLoading}>
        <Text style={authStyles.skipButtonText}>Use without account</Text>
      </TouchableOpacity>

      <Text style={authStyles.skipHint}>Your data will be stored locally only</Text>
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
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: '#dc2626',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 250,
    ...SHADOWS.sm,
  },
  googleButtonDisabled: {
    opacity: 0.6,
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
  skipButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
  },
  skipButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textDecorationLine: 'underline',
  },
  skipHint: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.light,
    textAlign: 'center',
  },
});

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'local';

const LOCAL_USER_KEY = '@bobapal:isLocalUser';

const useAuthStatus = (): {
  status: AuthStatus;
  setLocalUser: () => void;
  clearLocalUser: () => Promise<void>;
} => {
  const [status, setStatus] = useState<AuthStatus>('loading');

  const setLocalUser = useCallback(() => {
    AsyncStorage.setItem(LOCAL_USER_KEY, 'true');
    setStatus((prev) => {
      if (prev !== 'local') {
        console.log('[AuthStatus] Switching to local');
        return 'local';
      }
      return prev;
    });
  }, []);

  const clearLocalUser = useCallback(async () => {
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
    setStatus((prev) => {
      if (prev !== 'unauthenticated') {
        console.log('[AuthStatus] Clearing local user, switching to unauthenticated');
        return 'unauthenticated';
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const isLocalUser = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (isLocalUser === 'true') {
          if (isMounted) {
            setStatus((prev) => {
              if (prev !== 'local') {
                console.log('[AuthStatus] Detected local user');
                return 'local';
              }
              return prev;
            });
          }
          return;
        }

        console.log('[AuthStatus] Checking current user...');
        const user = await getCurrentUser();
        console.log('[AuthStatus] User found:', user?.userId);
        if (isMounted) {
          setStatus((prev) => {
            if (prev !== 'authenticated') {
              console.log('[AuthStatus] Switching to authenticated');
              return 'authenticated';
            }
            return prev;
          });
        }
      } catch {
        console.log('[AuthStatus] No user found, showing sign in');
        if (isMounted) {
          setStatus((prev) => {
            if (prev !== 'unauthenticated') {
              console.log('[AuthStatus] Switching to unauthenticated');
              return 'unauthenticated';
            }
            return prev;
          });
        }
      }
    };

    const timeoutId = setTimeout(() => {
      console.log('[AuthStatus] Auth check timed out, defaulting to unauthenticated');
      if (isMounted) {
        setStatus((current) => (current === 'loading' ? 'unauthenticated' : current));
      }
    }, 5000);

    checkAuth();

    const listener = Hub.listen('auth', ({ payload }) => {
      const anyPayload = payload as any;
      const event = anyPayload.event as string;
      const eventData = anyPayload.data ?? anyPayload.message ?? undefined;
      console.log('[AuthStatus] Hub event:', event, eventData ? eventData : '');
      if (event === 'signedIn' || event === 'signInWithRedirect') {
        setStatus((prev) => {
          if (prev !== 'authenticated') {
            console.log('[AuthStatus] Hub: switching to authenticated');
            return 'authenticated';
          }
          return prev;
        });
      }
      if (event === 'signedOut') {
        setStatus((prev) => {
          if (prev !== 'unauthenticated') {
            console.log('[AuthStatus] Hub: switching to unauthenticated');
            return 'unauthenticated';
          }
          return prev;
        });
      }
      if (event === 'signInWithRedirect_failure') {
        console.error('[AuthStatus] Sign in redirect failed. Error:', eventData ?? payload);
        setStatus((prev) => {
          if (prev !== 'unauthenticated') {
            console.log('[AuthStatus] Hub: switching to unauthenticated (redirect failure)');
            return 'unauthenticated';
          }
          return prev;
        });
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      listener();
    };
  }, []);

  return { status, setLocalUser, clearLocalUser };
};

const App: React.FC = () => {
  const { status: authStatus, setLocalUser } = useAuthStatus();

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
    console.log('[App] Rendering AuthenticatedApp (cloud user)');
    return <AuthenticatedApp isLocalUser={false} />;
  }

  if (authStatus === 'local') {
    console.log('[App] Rendering AuthenticatedApp (local user)');
    return <AuthenticatedApp isLocalUser={true} />;
  }

  console.log('[App] Rendering CustomSignIn');
  return <CustomSignIn onSkipLogin={setLocalUser} />;
};
App.displayName = 'App';

export default App;
