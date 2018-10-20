import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { colors } from '../constants/parameters';

const logo = require('../../assets/images/logos/logo_white.png');

const SplashScreen = () => (
  <View style={styles.container}>
    <FastImage
      source={logo}
      style={styles.logo}
      resizeMode={FastImage.resizeMode.contain}
    />
  </View>
);

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  logo: {
    width: '30%',
    height: '30%',
  },
});
