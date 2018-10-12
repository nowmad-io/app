/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Text from './Text';

import { colors, carousel, fonts } from '../constants/parameters';

export default class EmptyEntry extends PureComponent {
  static propTypes = {
    onAddLocationPress: PropTypes.func,
    onSharePress: PropTypes.func,
  };

  render() {
    const { onAddLocationPress, onSharePress } = this.props;

    return (
      <View style={styles.card}>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>
            Nobody added an experience in this area. Be the first one to review your favorite place or ask a friend about his experiences in this area.
          </Text>
          <Text style={styles.text}>
            Otherwise amplify your search area.
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Text
            style={styles.button}
            onPress={onAddLocationPress}
            uppercase
          >
            Add my location
          </Text>
          <Text
            style={styles.button}
            onPress={onSharePress}
            uppercase
          >
            Ask a friend
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    height: carousel.level2,
    backgroundColor: colors.yellowDark,
    position: 'relative',
    borderColor: colors.yellowDark,
    borderTopWidth: carousel.border,
    borderRadius: 2,
    elevation: 3,
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 16,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 4,
    color: colors.white,
    fontSize: 14,
    fontWeight: fonts.fontWeight.medium,
    marginRight: 24,
  },
});
