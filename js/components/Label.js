import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Text from './Text';

import { colors, fonts } from '../constants/parameters';

export default class Label extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    text: PropTypes.string,
    required: PropTypes.bool,
    subtitle: PropTypes.bool,
  };

  render() {
    const {
      style, text, subtitle, required,
    } = this.props;

    return (
      <View style={[
        styles.labelWrapper,
        subtitle && styles.labelWrapperSubtitle,
        style,
      ]}
      >
        <Text style={[
          styles.label,
          subtitle && styles.labelSubtitle,
        ]}
        >
          {text}
        </Text>
        { required && (
        <View style={styles.requiredWrapper}>
          <View style={styles.required} />
        </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelWrapper: {
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelWrapperSubtitle: {
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
    ...fonts.medium,
  },
  labelSubtitle: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.greyDark,
  },
  requiredWrapper: {
    height: '100%',
    marginLeft: 2,
  },
  required: {
    position: 'absolute',
    top: 4,
    height: 4,
    width: 4,
    backgroundColor: colors.red,
    borderRadius: 100,
  },
});
