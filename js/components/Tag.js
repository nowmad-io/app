import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import Text from './Text';

import { colors } from '../constants/parameters';

export default class Tag extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    selected: PropTypes.bool,
  };

  render() {
    const { onPress, text, selected } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <View style={[
          styles.tags,
          selected && styles.selected,
        ]}
        >
          {text ? (
            <Text style={[
              styles.text,
              selected && styles.textSelected,
            ]}
            >
              {text}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tags: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 28,
    backgroundColor: colors.white,
    paddingTop: 5,
    paddingBottom: 6,
    paddingHorizontal: 9,
    marginRight: 8,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 10,
    color: colors.black,
    lineHeight: 12,
  },
  textSelected: {
    color: colors.white,
  },
});
