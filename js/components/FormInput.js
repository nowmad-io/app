import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, StyleSheet } from 'react-native';

import Text from './Text';
import Icon from './Icon';

import { colors, fonts } from '../constants/parameters';

export default class FormInput extends Component {
  static propTypes = {
    style: PropTypes.any,
    inputStyle: PropTypes.any,
    showPasswordStyle: PropTypes.any,
    onChangeText: PropTypes.func,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    multiline: PropTypes.bool,
    autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    defaultValue: PropTypes.string,
    prefixIcon: PropTypes.string,
    prefixIconStyle: PropTypes.any,
    suffixIcon: PropTypes.string,
    suffixIconStyle: PropTypes.any,
    underlineColor: PropTypes.string,
    placeholderColor: PropTypes.string,
    selectionColor: PropTypes.string,
    password: PropTypes.bool,
  }

  static defaultProps = {
    onChangeText: () => {},
    placeholder: '',
    maxLength: null,
    multiline: false,
    defaultValue: '',
    underlineColor: colors.grey,
  }

  constructor(props) {
    super(props);

    this.state = {
      length: props.defaultValue && props.defaultValue.length || 0,
      showPassword: false,
    };
  }

  onChangeText(text) {
    this.setState({ length: text.length });
    this.props.onChangeText(text);
  }

  onShowPasswordPress = () => this.setState(
    ({ showPassword }) => ({ showPassword: !showPassword }),
  );

  render() {
    const {
      style,
      prefixIcon,
      prefixIconStyle,
      suffixIcon,
      suffixIconStyle,
      inputStyle,
      showPasswordStyle,
      underlineColor,
      placeholderColor,
      selectionColor,
      password,
      multiline,
      maxLength,
      placeholder,
      defaultValue,
      autoCapitalize,
    } = this.props;

    const { length, showPassword } = this.state;

    return (
      <View style={[styles.wrapper, style]}>
        <View
          style={[
            styles.inputWrapper,
            { borderColor: underlineColor },
          ]}
        >
          {prefixIcon && (
            <Icon
              name={prefixIcon}
              style={[
                styles.icon,
                prefixIcon && prefixIconStyle,
              ]}
            />
          )}
          <TextInput
            underlineColorAndroid="transparent"
            style={[
              styles.input,
              inputStyle,
            ]}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            maxLength={maxLength}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChangeText={text => this.onChangeText(text)}
            placeholderTextColor={placeholderColor}
            selectionColor={selectionColor}
            secureTextEntry={password && !showPassword}
            textContentType={password && 'none' || null}
          />
          {password && length > 0 && (
            <Text
              style={[
                styles.showPassword,
                suffixIcon && styles.suffixes,
                showPasswordStyle,
              ]}
              onPress={this.onShowPasswordPress}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          )}
          {suffixIcon && (
            <Icon
              name={suffixIcon}
              style={[
                styles.icon,
                suffixIcon && suffixIconStyle,
              ]}
            />
          )}
        </View>
        {maxLength && (
          <Text style={styles.length}>
            {length ? `${length}/` : ''}
            {maxLength}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  icon: {
    fontSize: 24,
    color: colors.grey,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingTop: 0,
    paddingBottom: 0,
  },
  length: {
    alignSelf: 'flex-end',
    marginRight: 4,
    fontSize: 10,
    color: colors.greyDark,
    ...fonts.medium,
  },
  showPassword: {
    fontSize: 10,
  },
  suffixes: {
    marginRight: 8,
  },
});
