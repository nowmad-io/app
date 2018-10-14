import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Text from './Text';
import Button from './Button';

import { colors, fonts } from '../constants/parameters';

export default class List extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    label: PropTypes.string,
    action: PropTypes.string,
    onActionPress: PropTypes.func,
    actionDisable: PropTypes.bool,
  };

  static defaultProps = {
    onActionPress: () => true,
  }

  render() {
    const {
      children, style, label, action, onActionPress, actionDisable,
    } = this.props;

    return (
      <View style={[styles.listContainer, style]}>
        {label && (
          <View style={styles.wrapper}>
            <Text uppercase style={styles.label}>
              {label}
            </Text>
            {action && (
              <Button
                onPress={!actionDisable ? onActionPress : () => true}
                transparent
                style={styles.actionButton}
              >
                <Text
                  uppercase={false}
                  style={[
                    styles.action,
                    actionDisable && styles.action_disable,
                  ]}
                >
                  {action}
                </Text>
              </Button>
            )}
          </View>
        )}

        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: colors.white,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    color: colors.greyDark,
    flex: 1,
    marginBottom: 18,
  },
  actionButton: {
    height: 14,
    margin: 0,
    padding: 0,
  },
  action: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: fonts.fontWeight.regular,
  },
  action_disable: {
    color: colors.primaryShadow,
  },
});
