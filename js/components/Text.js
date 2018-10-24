import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text as RNText, StyleSheet } from 'react-native';
import _ from 'lodash';

import { fonts, colors } from '../constants/parameters';

export default class Text extends Component {
  static propTypes = {
    ...RNText.propTypes,
    uppercase: PropTypes.bool,
    lowercase: PropTypes.bool,
    capitalize: PropTypes.bool,
    style: PropTypes.any,
    note: PropTypes.bool,
  };

  render() {
    const {
      uppercase, lowercase, capitalize, style, children, note,
    } = this.props;

    let text;
    if (uppercase || capitalize || lowercase) {
      text = React.Children.map(children, (child) => {
        if (_.isString(child)) {
          return uppercase ? _.toUpper(child) : lowercase ? _.toLower(child) : _.upperFirst(child);
        }
        return child;
      });
    } else {
      text = children;
    }

    return (
      <RNText
        {...this.props}
        style={[styles.text, note && styles.note, style]}
      >
        { text }
      </RNText>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 20,
    ...fonts.regular,
    color: colors.black,
  },
  note: {
    color: colors.greyDark,
  },
});
