import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import GradientBackground from './GradientBackground';
import { COLORS } from '../src/constants/theme';

interface LoadingStateProps {
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
