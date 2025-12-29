import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/theme';

interface LoadingStateProps {
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ fullScreen = true }) => {
  const Container = fullScreen ? SafeAreaView : View;

  return (
    <Container style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
