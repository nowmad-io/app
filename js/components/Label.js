import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Text from './Text';

import { colors } from '../constants/parameters';

export default class Label extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    required: PropTypes.bool,
    subtitle: PropTypes.bool,
  };

  render() {
    const { text, subtitle, required } = this.props;

    return (
      <View style={[
        styles.labelWrapper,
        subtitle && styles.labelWrapperSubtitle,
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
    fontWeight: '500',
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
