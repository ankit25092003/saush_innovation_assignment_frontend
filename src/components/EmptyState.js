import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { fontSize, fontWeight, spacing } from '../theme';

const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionButton, { backgroundColor: colors.primarySurface }]}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['4xl'],
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  actionText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});

export default EmptyState;
