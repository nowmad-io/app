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
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.black,
  },
  textSelected: {
    color: colors.white,
  },
});
