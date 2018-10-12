import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from './Icon';

import { colors, carousel } from '../constants/parameters';

export default class Entry extends Component {
  static propTypes = {};

  render() {
    return (
      <View
        style={styles.card}
      >
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.8}
          onPress={this.addOrEditReview}
        >
          <Icon
            name="edit"
            style={styles.cta_icon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    height: carousel.level2,
    backgroundColor: colors.white,
    position: 'relative',
    borderColor: colors.primary,
    borderTopWidth: carousel.border,
    borderRadius: 2,
    elevation: 3,
  },
  googleCard: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.lightGreen,
  },
  cta: {
    backgroundColor: colors.yellowTransparent,
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 64,
    width: 64,
    borderTopRightRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 10,
  },
  cta_icon: {
    color: colors.white,
    fontSize: 32,
  },
  cta_edit: {
    fontSize: 28,
  },
});
