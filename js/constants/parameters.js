import { Dimensions, Platform, StatusBar } from 'react-native';
import hexRgb from 'hex-rgb';

const { width, height } = Dimensions.get('window');

function rgba(hex, a = null) {
  const {
    red, green, blue, alpha,
  } = hexRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${a !== null ? a : alpha})`;
}

const plain = {
  primary: '#1DA07F',
  primaryLight: '#BBE2D8',
  white: '#fff',
  black: '#000',
  grey: '#BCB9B9',
  greyDark: '#5E5D5D',
  yellowDark: '#FFB000',
};

export const colors = {
  ...plain,
  primaryShadow: rgba(plain.primary, 0.4),
  primaryShadowDark: rgba(plain.primary, 0.8),
  whiteTransparent: rgba(plain.white, 0.8),
  blackTransparentLight: rgba(plain.black, 0.2),
  blackTransparent: rgba(plain.black, 0.6),
  blackShadow: {
    elevation: 2,
    shadowColor: plain.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
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
  height: Platform.OS === 'ios' ? height : height - StatusBar.currentHeight,
  width,
  headerHeight: 56,
  drawerWidth: 304,
};

const ITEM_SPACING = 8;

export const carousel = {
  sliderWidth: sizes.width,
  itemSpacing: ITEM_SPACING,
  itemWidth: sizes.width - (ITEM_SPACING * 2),
  level1: 80,
  level2: 166,
  border: 4,
};
