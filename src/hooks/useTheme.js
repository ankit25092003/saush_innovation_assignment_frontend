import React from 'react';
import { useSelector } from 'react-redux';
import { lightColors, darkColors } from '../theme/colors';

/**
 * Custom hook that returns the current theme colors
 */
export const useTheme = () => {
  const mode = useSelector((state) => state.theme.mode);
  const colors = mode === 'dark' ? darkColors : lightColors;
  return { colors, isDark: mode === 'dark', mode };
};
