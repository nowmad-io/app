import { Dimensions } from 'react-native';
import hexRgb from 'hex-rgb';

const { width, height } = Dimensions.get('window');

function rgba(hex, a = null) {
  const {
    red, green, blue, alpha,
  } = hexRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${a !== null ? a : alpha})`;
}

const primary = '#1DA07F';
const white = '#fff';

export const colors = {
  primary,
  white,
  lightWhite: rgba(white, 0.8),
};

export const fonts = {
  fontFamily: 'Roboto',
  fontWeight: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
    black: '900',
  },
  fontStyle: {
    normal: 'normal',
    italic: 'italic',
  },
};

export const sizes = {
  width,
  height,
  headerHeight: 56,
  drawerWidth: 304,
};
