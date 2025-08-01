export const Colors = {
  primary: '#6C5CE7', // Violet
  secondary: '#00CEC9', // Teal
  accent: '#FDCB6E', // Yellow accent
  
  // Grayscale
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#2D3436',
  textSecondary: '#636E72',
  border: '#DDD6FE',
  divider: '#E5E7EB',
  
  // Status colors
  success: '#00B894',
  warning: '#E17055',
  error: '#D63031',
  info: '#0984E3',
  
  // Event type colors
  vote: '#6C5CE7',
  ticket: '#00CEC9',
  
  // Transparency variants
  primaryLight: '#6C5CE720',
  secondaryLight: '#00CEC920',
  backgroundDark: '#2D3436',
};

export const Typography = {
  // Font families
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium', 
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.20,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 10,
  },
};

export const Layout = {
  // Screen padding
  screenPadding: Spacing.md,
  
  // Common heights
  headerHeight: 60,
  tabBarHeight: 80,
  buttonHeight: 48,
  inputHeight: 48,
  
  // Common widths
  buttonMinWidth: 120,
  
  // Border widths
  borderWidth: 1,
  borderWidthThick: 2,
};

export const theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
};