import React, { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colors, typography } from './tokens';

const getDesignTokens = () => ({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.purplePrimary,
      light: colors.purpleSecondary,
      dark: colors.purpleDeep,
      contrastText: colors.textPrimary,
    },
    secondary: { main: colors.purpleSecondary, contrastText: colors.textPrimary },
    background: { default: colors.bgPrimary, paper: colors.surface },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    divider: colors.border,
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: { fontSize: '64px', fontWeight: 700, lineHeight: 1.1, color: colors.textPrimary },
    h2: { fontSize: '40px', fontWeight: 600, lineHeight: 1.15, color: colors.textPrimary },
    h3: { fontSize: '32px', fontWeight: 600, lineHeight: 1.2, color: colors.textPrimary },
    h4: { fontSize: '20px', fontWeight: 600, lineHeight: 1.3, color: colors.textPrimary },
    body1: { fontSize: '16px', lineHeight: 1.6, color: colors.textSecondary },
    body2: { fontSize: '14px', lineHeight: 1.5, color: colors.textSecondary },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600, boxShadow: 'none' },
        containedPrimary: {
          backgroundColor: colors.purplePrimary,
          border: '1px solid ' + colors.purplePrimary,
          '&:hover': { backgroundColor: colors.purpleDeep, borderColor: colors.purpleDeep },
        },
        outlined: {
          borderColor: colors.border,
          color: colors.textPrimary,
          '&:hover': { borderColor: colors.borderPurple },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundColor: colors.surface, border: '1px solid ' + colors.border, borderRadius: 16, boxShadow: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: colors.surface, backgroundImage: 'none', border: '1px solid ' + colors.border, boxShadow: 'none' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: colors.surfaceElevated,
            borderRadius: 10,
            color: colors.textPrimary,
            '& fieldset': { borderColor: colors.border },
            '&:hover fieldset': { borderColor: colors.borderPurple },
            '&.Mui-focused fieldset': { borderColor: colors.purplePrimary },
          },
          '& .MuiInputLabel-root': { color: colors.textMuted },
        },
      },
    },
  },
});

const Theme = ({ children }) => {
  const theme = useMemo(() => createTheme(getDesignTokens()), []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
