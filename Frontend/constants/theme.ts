// ─── Color Palette ──────────────────────────────────────────
export const colors = {
  primary: '#4A90D9',
  primaryDark: '#2E6DB4',
  secondary: '#34C759',
  accent: '#FF6B6B',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  authCardBg: '#CDE7FA',
  black: '#1A1A1A',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
} as const;

// ─── Spacing ─────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── Typography ───────────────────────────────────────────────
export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  h1Serif: {
    fontSize: 36,
    fontFamily: 'serif',
    fontWeight: '700' as const,
    lineHeight: 42,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
} as const;

// ─── Border Radius ────────────────────────────────────────────
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
