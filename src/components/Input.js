import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, fontSize, fontWeight, spacing } from '../theme';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  icon,
  style,
  inputStyle,
  editable = true,
}) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error
              ? colors.error
              : focused
              ? colors.inputFocusBorder
              : colors.inputBorder,
            borderWidth: focused ? 1.5 : 1,
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: multiline ? numberOfLines * 20 : undefined,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  iconContainer: {
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.base,
    fontSize: fontSize.base,
  },
  errorText: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input;
