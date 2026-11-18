// AuthentiScan Twinkle Design Tokens
// Spec sections 3, 4, 5, 6. Single source of truth for UI only.

export const colors = {
  bgPrimary: '#050507',
  bgSecondary: '#0A0A0F',
  surface: '#101016',
  surfaceElevated: '#15151D',
  purplePrimary: '#6D4AFF',
  purpleSecondary: '#8B72FF',
  purpleDeep: '#4F23F8',
  textPrimary: '#F2F0F8',
  textSecondary: '#A5A1B2',
  textMuted: '#706C7A',
  border: 'rgba(255,255,255,0.10)',
  borderPurple: 'rgba(109,74,255,0.45)',
  purpleHoverBg: 'rgba(109,74,255,0.04)',
  success: '#35C98A',
  warning: '#E9B949',
  error: '#E05A6D',
};

export const radius = {
  control: 8,
  button: 10,
  card: 16,
  cardLarge: 20,
  modal: 20,
};

export const typography = {
  fontFamily: "'Manrope', 'DM Sans', 'IBM Plex Sans', sans-serif",
  hero: { fontSize: '64px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' },
  pageHeading: { fontSize: '40px', fontWeight: 600, lineHeight: 1.15 },
  sectionHeading: { fontSize: '32px', fontWeight: 600, lineHeight: 1.2 },
  cardHeading: { fontSize: '20px', fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: '16px', lineHeight: 1.6 },
  secondary: { fontSize: '14px', lineHeight: 1.5 },
  metadata: { fontSize: '12px', lineHeight: 1.4, letterSpacing: '0.06em' },
};

export const layout = {
  maxWidth: 1280,
  paddingDesktop: 40,
  paddingTablet: 24,
  paddingMobile: 18,
};

export const motion = {
  duration: 0.35,
  pageInitial: { opacity: 0, y: 10 },
  pageAnimate: { opacity: 1, y: 0 },
};

const tokens = { colors, radius, typography, layout, motion };

export default tokens;
