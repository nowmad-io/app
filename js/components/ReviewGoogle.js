import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import Text from './Text';
import Avatar from './Avatar';
import Spinner from './Spinner';

import { fonts, colors } from '../constants/parameters';

export default class ReviewGoogle extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    pictures: PropTypes.array,
    loading: PropTypes.bool,
  }

  render() {
    const { name, pictures, loading } = this.props;

    return (
      <View style={styles.review}>
        <View style={styles.header}>
          <Avatar
            set="FontAwesome"
            icon="google"
          />
          <View
            style={styles.header_right}
            onLayout={this._onLayout}
          >
            <Text style={styles.user_text} capitalize numberOfLines={1}>
              {name}
            </Text>
            <Text>Google</Text>
          </View>
        </View>
        <View style={styles.body}>
          <Spinner visible={loading} color={colors.white} />
          {_.map(pictures, ({ uid, uri }, index) => (
            <FastImage
              key={uid}
              source={{ uri }}
              style={[
                styles.picture,
                (index === _.size(pictures) - 1) && { marginRight: 0 },
              ]}
              resizeMode="cover"
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  review: {
    paddingTop: 10,
    marginHorizontal: 16,
    flex: 1,
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  header_right: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  user_text: {
    ...fonts.medium,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: '100%',
    height: '100%',
    flex: 1,
    marginRight: 8,
  },
});
