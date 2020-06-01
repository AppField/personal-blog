const COLORS = {
  text: {
    light: '#121212',
    dark: '#f4f5f8',
  },
  background: {
    light: '#f4f5f8',
    dark: '#121212',
  },
  primary: {
    light: '#ae2a59', // Pinkish-red
    dark: '#ae2a59', // Yellow
  },
  secondary: {
    light: '#4b5169', // Purplish-blue
    dark: '#4b5169', // Cyan
  },
  // Grays, scaling from least-noticeable to most-noticeable
};

const COLOR_MODE_KEY = 'color-mode';
const INITIAL_COLOR_MODE_CSS_PROP = '--initial-color-mode';

export { COLORS, COLOR_MODE_KEY, INITIAL_COLOR_MODE_CSS_PROP };
