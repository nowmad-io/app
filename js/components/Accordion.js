import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import Text from './Text';
import Icon from './Icon';

import { colors, fonts } from '../constants/parameters';

export default class Accordion extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.any,
    label: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: true,
    };
  }

  toggle = () => this.setState(prevState => ({ expanded: !prevState.expanded }));

  render() {
    const { expanded } = this.state;
    const { children, style, label } = this.props;

    return (
      <View>
        <TouchableOpacity
          onPress={this.toggle}
          style={[styles.labelWrapper, style]}
        >
          <Text style={styles.label}>
            { label }
          </Text>
          <Icon
            style={styles.icon}
            name={`keyboard-arrow-${expanded ? 'up' : 'down'}`}
          />
        </TouchableOpacity>
        {expanded && (
          <View>
            { children }
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  label: {
    ...fonts.medium,
  },
  icon: {
    fontSize: 28,
    color: colors.primaryDark,
  },
  wrapper: {
    overflow: 'hidden',
  },
});
