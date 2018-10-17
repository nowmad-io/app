import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

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
            <Text style={styles.user_text} capitalize>
              {name}
            </Text>
            <Text>Google</Text>
          </View>
        </View>
        <View style={styles.body}>
          <Spinner visible={loading} />
          {pictures && pictures.slice(0, 1).map(({ uid, uri }) => (
            <FastImage
              key={uid}
              source={{ uri }}
              style={[
                styles.picture,
                { marginRight: 0 },
              ]}
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
    marginBottom: 16,
    marginHorizontal: 16,
    flex: 1,
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  header_right: {
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  user_text: {
    ...fonts.medium,
  },
  others: {
    flexDirection: 'row',
  },
  others_avatar: {
    marginRight: 2,
  },
  others_avatar_text: {
    fontSize: 9,
    lineHeight: 11,
  },
  others_avatar_image: {
    borderWidth: 1,
  },
  body: {
    flex: 1,
  },
  bodyNoDetail: {
    maxHeight: 84,
    flexDirection: 'row',
  },
  picture: {
    flex: 1,
    marginRight: 12,
  },
  picture_detail: {
    height: 150,
    marginBottom: 12,
  },
  body_right: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    ...fonts.medium,
    color: colors.greyDark,
  },
  description_noimage: {
    fontSize: 22,
    lineHeight: 28,
    ...fonts.regular,
  },
  description_detail: {
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
  },
  categorie: {
    color: colors.primaryShadowDark,
    fontSize: 14,
    lineHeight: 16,
  },
  googleAvatar: {
    color: colors.greyDark,
  },
});
