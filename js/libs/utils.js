import { Platform } from 'react-native';
import _ from 'lodash';

const fontWeightMapping = (styleToMap) => {
  if (!styleToMap) {
    return styleToMap;
  }
  const { fontFamily, fontWeight, ...style } = styleToMap;

  if (Platform.OS === 'ios') { return { fontFamily, fontWeight, ...style }; }
  switch (fontWeight) {
    case 'normal': return { fontFamily: `${fontFamily}-Regular`, fontWeight: undefined };
    case 'bold': return { fontFamily: `${fontFamily}-Bold`, fontWeight: undefined };
    case '100': return { fontFamily: `${fontFamily}-Thin`, fontWeight: undefined };
    case '200': return { fontFamily: `${fontFamily}-ExtraLight`, fontWeight: undefined };
    case '300': return { fontFamily: `${fontFamily}-Light`, fontWeight: undefined };
    case '400': return { fontFamily: `${fontFamily}-Regular`, fontWeight: undefined };
    case '500': return { fontFamily: `${fontFamily}-Medium`, fontWeight: undefined };
    case '600': return { fontFamily: `${fontFamily}-SemiBold`, fontWeight: undefined };
    case '700': return { fontFamily: `${fontFamily}-Bold`, fontWeight: undefined };
    case '800': return { fontFamily: `${fontFamily}-ExtraBold`, fontWeight: undefined };
    case '900': return { fontFamily: `${fontFamily}-Black`, fontWeight: undefined };
    default: {
      return fontFamily
        ? { fontFamily: `${fontFamily}-Regular`, fontWeight: undefined, ...style }
        : { ...style };
    }
  }
};

// eslint-disable-next-line import/prefer-default-export
export const getFontStyleForWeight = (styles) => {
  if (_.isArray(styles)) {
    return _.map(styles, fontWeightMapping);
  }

  return fontWeightMapping(getFontStyleForWeight);
};
