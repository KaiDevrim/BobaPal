import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signOut, deleteUser, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

import { GradientBackground } from '../components';
import { RootStackParamList } from '../src/types/navigation';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../src/constants/theme';

interface UserInfo {
  email: string | null;
  signInMethod: string;
  userId: string;
}

const PRIVACY_POLICY_URL = 'https://github.com/KaiDevrim/BobaPal/blob/main/PRIVACY_POLICY.md';
const CONTACT_EMAIL = 'support@devrim.tech';

const Profile: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        // Determine sign-in method
        let signInMethod = 'Email';
        if (attributes.identities) {
          try {
            const identities = JSON.parse(attributes.identities);
            if (identities.length > 0) {
              const provider = identities[0].providerName;
              if (provider === 'Google') {
                signInMethod = 'Google';
              } else if (provider === 'Facebook') {
                signInMethod = 'Facebook';
              } else if (provider === 'Apple') {
                signInMethod = 'Apple';
              } else {
                signInMethod = provider || 'Social';
              }
            }
          } catch {
            // If parsing fails, default to Email
          }
        }

        setUserInfo({
          email: attributes.email || null,
          signInMethod,
          userId: user.userId,
        });
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to fetch user info:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSignOut = useCallback(async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setIsSigningOut(true);
          try {
            await signOut();
          } catch (error) {
            if (__DEV__) {
              console.error('Sign out error:', error);
            }
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Confirm Deletion', 'Please type DELETE to confirm account deletion.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Confirm',
                style: 'destructive',
                onPress: async () => {
                  setIsDeleting(true);
                  try {
                    await deleteUser();
                    Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
                  } catch (error) {
                    if (__DEV__) {
                      console.error('Delete account error:', error);
                    }
                    Alert.alert('Error', 'Failed to delete account. Please try again.');
                  } finally {
                    setIsDeleting(false);
                  }
                },
              },
            ]);
          },
        },
      ]
    );
  }, []);

  const handlePrivacyPolicy = useCallback(async () => {
    try {
      await Linking.openURL(PRIVACY_POLICY_URL);
    } catch {
      Alert.alert('Error', 'Could not open privacy policy.');
    }
  }, []);

  const handleContact = useCallback(async () => {
    try {
      await Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=BobaPal%20Support`);
    } catch {
      Alert.alert('Contact Us', `Email us at ${CONTACT_EMAIL}`);
    }
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (isLoading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sign-in Method</Text>
              <View style={styles.methodBadge}>
                <Text style={styles.methodText}>
                  {userInfo?.signInMethod === 'Google' ? '🔵 ' : '📧 '}
                  {userInfo?.signInMethod || 'Unknown'}
                </Text>
              </View>
            </View>

            {userInfo?.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userInfo.email}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.linkButton} onPress={handlePrivacyPolicy}>
            <Text style={styles.linkButtonText}>📄 Privacy Policy</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={handleContact}>
            <Text style={styles.linkButtonText}>✉️ Contact Us</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.signOutButton]}
            onPress={handleSignOut}
            disabled={isSigningOut}>
            {isSigningOut ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.signOutText}>Sign Out</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
            disabled={isDeleting}>
            {isDeleting ? (
              <ActivityIndicator size="small" color={COLORS.error} />
            ) : (
              <Text style={styles.deleteText}>Delete Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BobaPal v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with 🧋 by Devrim</Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: {
    padding: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text.accent,
  },
  placeholder: {
    width: 60,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  methodBadge: {
    backgroundColor: COLORS.backgroundAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  methodText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  linkArrow: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.light,
  },
  actionButton: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  signOutButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  signOutText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deleteText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.light,
  },
  footerSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.light,
    marginTop: SPACING.xs,
  },
});

export default memo(Profile);
