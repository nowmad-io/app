import { Dimensions, Platform, StatusBar } from 'react-native';
import hexRgb from 'hex-rgb';

const { width, height } = Dimensions.get('window');

export const rgba = (hex, a = null) => {
  const {
    red, green, blue, alpha,
  } = hexRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${a !== null ? a : alpha})`;
};

const plain = {
  primary: '#1DA07F',
  primaryLight: '#BBE2D8',
  primaryDark: '#5E8C7F',
  white: '#fff',
  black: '#000',
  grey: '#BCB9B9',
  greyDark: '#5E5D5D',
  yellow: '#FFC546',
  yellowDark: '#FFB000',
  red: '#FF4A40',
  blue: '#0076FF',
};

export const colors = {
  ...plain,
  primaryShadowLight: rgba(plain.primary, 0.2),
  primaryShadow: rgba(plain.primary, 0.4),
  primaryShadowDark: rgba(plain.primary, 0.6),
  primaryShadowDarker: rgba(plain.primary, 0.8),
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
  yellowTransparent: rgba(plain.yellow, 0.95),
};

const fontFamily = 'AvenirNextLTPro';
export const fonts = {
  thin: { fontFamily: `${fontFamily}-Thin`, fontWeight: undefined },
  extraLight: { fontFamily: `${fontFamily}-ExtraLight`, fontWeight: undefined },
  light: { fontFamily: `${fontFamily}-Light`, fontWeight: undefined },
  regular: { fontFamily: `${fontFamily}-Regular`, fontWeight: undefined },
  medium: { fontFamily: `${fontFamily}-Medium`, fontWeight: undefined },
  demiBold: { fontFamily: `${fontFamily}-Demi`, fontWeight: undefined },
  bold: { fontFamily: `${fontFamily}-Bold`, fontWeight: undefined },
  heavy: { fontFamily: `${fontFamily}-Heavy`, fontWeight: undefined },
};

export const sizes = {
  height: Platform.OS === 'ios' ? height : height - StatusBar.currentHeight,
  width,
  headerHeight: 48,
  drawerWidth: width * 0.9,
  searchBarPadding: 8,
  toolBar: 48,
};

export const carousel = {
  entryMargin: Math.floor(width * 0.011),
  entryWidth: Math.floor(width * 0.88),
  height: 168,
  border: 4,
};
