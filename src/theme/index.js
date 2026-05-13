/**
 * @file index.js
 * @description Punto de entrada del tema. Exporta la configuración completa del tema y la integración con React Native Paper.
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { shadows } from './shadows';
import { layout } from './layout';
import { zIndex } from './zIndex';
import { MD3DarkTheme } from 'react-native-paper';

export const theme = {
    colors,
    typography,
    spacing,
    radii,
    shadows,
    layout,
    zIndex,
};

// Configuración para React Native Paper
export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.primaryButtonBackground,
    error: colors.danger,
    background: colors.background,
    surface: colors.cardBackground,
    text: colors.text,
    onSurface: colors.text,
    outline: colors.inputBorder,
  },
};
