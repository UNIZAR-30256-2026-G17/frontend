// src/theme/shadows.js
import { Platform } from 'react-native';

const shadow = (elevation) =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.15,
      shadowRadius: elevation * 1.5,
    },
    android: { elevation },
    web: { boxShadow: `0px ${elevation}px ${elevation * 2}px rgba(0,0,0,0.15)` },
    default: {},
  });

export const shadows = {
  sm: shadow(2),
  md: shadow(4),
  lg: shadow(8),
  xl: shadow(16),
  glow: (color = '#FFD100', intensity = 0.6) => Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: intensity,
      shadowRadius: 15,
    },
    android: { elevation: 6 },
    web: { boxShadow: `0px 0px 20px ${color}88` },
  }),
};
