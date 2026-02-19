import { useCallback } from 'react';

const colors = {
  primary: '#0D7C66',
  primaryDark: '#0A6354',
  primaryLight: '#E0F2ED',
  accent: '#F59E0B',
  accentLight: '#FEF3C7',
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFA',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  overlay: 'rgba(0,0,0,0.45)',
  shadow: 'rgba(0,0,0,0.08)',
  white: '#FFFFFF',
  black: '#000000',
  rating: '#FBBF24',
  discount: '#EF4444',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

const fonts = {
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    xxxl: 32,
    hero: 40,
  },
};

const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

const theme = { colors, spacing, fonts, borderRadius, shadows };

export const useTheme = () => {
  return theme;
};

export default theme;
