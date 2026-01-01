import React, { memo, ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface GradientBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
}

// Warm, boba-themed gradient colors
const GRADIENT_COLORS = ['#FFF8F0', '#FFE8D6', '#FFF5EB'] as const;

const DEFAULT_EDGES: Edge[] = ['top', 'bottom'];

const GradientBackground: React.FC<GradientBackgroundProps> = memo(
  ({ children, style, edges = DEFAULT_EDGES }) => {
    return (
      <LinearGradient
        colors={[...GRADIENT_COLORS]}
        style={[styles.gradient, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}>
        <SafeAreaView style={styles.safeArea} edges={edges}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    );
  }
);

GradientBackground.displayName = 'GradientBackground';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

export default GradientBackground;
