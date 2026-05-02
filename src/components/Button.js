import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, fontSize, fontWeight, spacing } from '../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.base, fontSize: fontSize.sm },
    md: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl, fontSize: fontSize.base },
    lg: { paddingVertical: spacing.base, paddingHorizontal: spacing['2xl'], fontSize: fontSize.md },
  };

  const currentSize = sizeStyles[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[{ opacity: disabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            {
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              {icon}
              <Text
                style={[
                  styles.text,
                  {
                    color: '#FFFFFF',
                    fontSize: currentSize.fontSize,
                    marginLeft: icon ? spacing.sm : 0,
                  },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles = {
    secondary: {
      bg: colors.primarySurface,
      text: colors.primary,
      border: 'transparent',
    },
    outline: {
      bg: 'transparent',
      text: colors.primary,
      border: colors.primary,
    },
    ghost: {
      bg: 'transparent',
      text: colors.primary,
      border: 'transparent',
    },
    danger: {
      bg: colors.errorSurface,
      text: colors.error,
      border: 'transparent',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.secondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: currentVariant.bg,
          borderColor: currentVariant.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.text} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              {
                color: currentVariant.text,
                fontSize: currentSize.fontSize,
                marginLeft: icon ? spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
});

export default Button;
