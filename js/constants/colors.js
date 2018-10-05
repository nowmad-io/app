import hexRgb from 'hex-rgb';

function rgba(hex, a = null) {
  const {
    red, green, blue, alpha,
  } = hexRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${a !== null ? a : alpha})`;
}

const primary = '#1DA07F';
const white = '#fff';

export default {
  primary,
  white,
  lightWhite: rgba(white, 0.8),
};
