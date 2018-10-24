import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import Text from './Text';
import Avatar from './Avatar';

import { fonts, colors } from '../constants/parameters';

export default class Review extends PureComponent {
  static initials({ firstName, lastName }) {
    return (firstName && lastName) ? firstName[0] + lastName[0] : '';
  }

  static propTypes = {
    style: PropTypes.any,
    onPress: PropTypes.func,
    categories: PropTypes.array,
    own: PropTypes.bool,
    createdBy: PropTypes.object,
    friends: PropTypes.array,
    shortDescription: PropTypes.string,
    information: PropTypes.string,
    status: PropTypes.string,
    pictures: PropTypes.array,
    cover: PropTypes.bool,
    detail: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      xHeaderRight: 0,
    };
  }

  _onLayout = ({ nativeEvent: { layout: { x } } }) => {
    this.setState({ xHeaderRight: x });
  }

  render() {
    const { xHeaderRight } = this.state;
    const {
      style,
      onPress,
      own,
      shortDescription,
      information,
      createdBy,
      friends,
      categories,
      pictures,
      status,
      cover,
      detail,
    } = this.props;

    return (
      <View
        style={[
          styles.review,
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress ? 0.8 : 1}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <Avatar
              uri={createdBy.photoURL}
              text={own ? 'me' : Review.initials(createdBy)}
              uppercase={!own}
              size={36}
            />
            <View
              style={styles.header_right}
              onLayout={this._onLayout}
            >
              <Text style={styles.text}>
                <Text style={styles.user_text} capitalize>
                  {`${own ? 'me' : createdBy.firstName}`}
                </Text>
                {friends && friends.length ? ` and ${friends.length} more friend${friends.length > 1 ? 's' : ''}` : ''}
              </Text>
              {friends && friends.length ? (
                <View style={styles.others}>
                  { friends.map(({ uid, photoURL, ...friend }) => (
                    <Avatar
                      key={uid}
                      uri={photoURL}
                      style={[
                        styles.others_avatar,
                        !photoURL && styles.others_avatar_image,
                      ]}
                      textStyle={styles.others_avatar_text}
                      text={Review.initials(friend)}
                      size={18}
                    />
                  )) }
                </View>
              ) : (
                <Text lowercase style={styles.text}>
                  {`was ${status}`}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              styles.body,
              !detail && styles.bodyNoDetail,
            ]}
          >
            { (pictures && pictures.length > 0 && pictures[0].uri) && (
              <FastImage
                source={{ uri: pictures[0].uri }}
                style={detail ? styles.picture_detail : styles.picture}
                resizeMode="cover"
              />
            )}
            <View
              style={[
                !detail && styles.body_right,
                cover && (!pictures || !pictures.length) && {
                  paddingLeft: xHeaderRight,
                },
              ]}
            >
              <Text
                style={[
                  styles.description,
                  detail && styles.descriptionDetail,
                ]}
                numberOfLines={detail ? null : 1}
              >
                {shortDescription}
              </Text>
              <Text
                style={[
                  styles.information,
                  detail && styles.informationDetail,
                ]}
                numberOfLines={detail ? null : 2}
              >
                {information}
              </Text>
              <Text
                style={[
                  styles.categorie,
                  detail && styles.categorieDetail,
                ]}
                numberOfLines={detail ? null : 1}
              >
                {_.join(categories, ' · ')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
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
    marginBottom: 10,
    flexDirection: 'row',
  },
  header_right: {
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  text: {
    lineHeight: 18,
  },
  user_text: {
    lineHeight: 18,
    ...fonts.medium,
  },
  others: {
    flexDirection: 'row',
  },
  others_avatar: {
    marginRight: 2,
  },
  others_avatar_text: {
    fontSize: 8,
    lineHeight: 12,
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
    width: '100%',
    height: '100%',
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
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 4,
  },
  descriptionDetail: {
    fontSize: 22,
    lineHeight: 26,
    ...fonts.regular,
    marginBottom: 12,
  },
  information: {
    fontSize: 18,
    lineHeight: 22,
    ...fonts.medium,
    marginBottom: 2,
  },
  informationDetail: {
    fontSize: 16,
    lineHeight: 20,
    ...fonts.regular,
    marginBottom: 12,
  },
  categorie: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 14,
  },
  categorieDetail: {
    fontSize: 16,
    lineHeight: 20,
    ...fonts.medium,
  },
});
