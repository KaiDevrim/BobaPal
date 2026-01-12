import React, { memo, ReactNode } from 'react';
import { StyleSheet, ViewStyle, View, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

// Warm, boba-themed gradient colors
const GRADIENT_COLORS = ['#FFF8F0', '#FFE8D6', '#FFF5EB'] as const;

const DEFAULT_EDGES: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom'];

const GradientBackground: React.FC<GradientBackgroundProps> = memo(
  ({ children, style, edges = DEFAULT_EDGES }) => {
    // Workaround: Use regular View instead of SafeAreaView to avoid crash
    // SafeAreaProvider in App.tsx will handle the top-level safe area
    return (
      <LinearGradient
        colors={[...GRADIENT_COLORS]}
        style={[styles.gradient, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}>
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    );
  }
);

GradientBackground.displayName = 'GradientBackground';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
});

export default GradientBackground;
