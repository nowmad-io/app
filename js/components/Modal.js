import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, View, Modal as RNModal,
} from 'react-native';

import Text from './Text';

import { colors, fonts } from '../constants/parameters';

export default class Modal extends PureComponent {
  static propTypes = {
    animationType: PropTypes.string,
    transparent: PropTypes.bool,
    visible: PropTypes.bool,
    onRequestClose: PropTypes.func,
    title: PropTypes.string,
    information: PropTypes.string,
    primaryAction: PropTypes.string,
    onPrimaryAction: PropTypes.func,
    secondaryAction: PropTypes.string,
    onSecondaryAction: PropTypes.func,
  };

  static defaultProps = {
    animationType: 'fade',
    transparent: true,
    visible: false,
    onRequestClose: () => true,
  }

  render() {
    const {
      animationType, transparent, visible, onRequestClose,
      title, information, primaryAction, onPrimaryAction, secondaryAction, onSecondaryAction,
    } = this.props;

    return (
      <RNModal
        animationType={animationType}
        transparent={transparent}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.wrapper}>
          <View style={styles.modal}>
            <Text style={styles.text}>
              {title}
            </Text>
            <Text
              style={[
                styles.text,
                styles.information,
              ]}
            >
              {information}
            </Text>
            <View style={styles.actionsWrapper}>
              {primaryAction && (
                <Text
                  uppercase
                  onPress={onPrimaryAction}
                  style={[
                    styles.text,
                    styles.action,
                  ]}
                >
                  {primaryAction}
                </Text>
              )}
              {secondaryAction && (
                <Text
                  uppercase
                  onPress={onSecondaryAction}
                  style={[
                    styles.text,
                    styles.action,
                    styles.secondaryAction,
                  ]}
                >
                  {secondaryAction}
                </Text>
              )}
            </View>
          </View>
        </View>
      </RNModal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blackTransparentLight,
  },
  modal: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: colors.white,
    marginHorizontal: 24,
    elevation: 4,
    paddingVertical: 20,
    paddingHorizontal: 24,
    minHeight: 182,
  },
  actionsWrapper: {
    flexDirection: 'row',
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: fonts.fontWeight.regular,
    lineHeight: 20,
  },
  action: {
    color: colors.primary,
  },
  secondaryAction: {
    marginLeft: 32,
  },
  information: {
    flex: 1,
    marginTop: 16,
    color: colors.grey,
  },
});
