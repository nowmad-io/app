import { Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  window: {
    width,
    height,
  },
  statusBar: StatusBar.currentHeight || 0,
};
