import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';

interface StatsCardProps {
  icon: string;
  number: number | string;
  label: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, number, label }) => (
  <View style={styles.card}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    borderWidth: 3,
    borderColor: COLORS.text.accent,
    shadowColor: COLORS.text.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
  },
  icon: {
    fontSize: FONT_SIZES.xxxl,
    marginBottom: SPACING.sm,
  },
  number: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text.accent,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.text.accent,
    letterSpacing: 1,
  },
});

