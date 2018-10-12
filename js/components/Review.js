import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import Text from './Text';
import Avatar from './Avatar';

import { fonts, colors } from '../constants/parameters';

export default class Review extends PureComponent {
  static initials({ first_name: firstName, last_name: lastName }) {
    return (firstName && lastName) ? firstName[0] + lastName[0] : '';
  }

  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    review: PropTypes.object,
    others: PropTypes.array,
    onPress: PropTypes.func,
    cover: PropTypes.bool,
    gPlace: PropTypes.bool,
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
      review: {
        short_description: shortDescription,
        created_by: createdBy,
        categories,
        pictures,
        status,
      },
      others,
      gPlace,
      cover,
      detail,
    } = this.props;

    return (
      <View style={[
        styles.review,
        style && style,
      ]}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress ? 0.8 : 1}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <Avatar
              uri={createdBy.picture}
              text={Review.initials(createdBy)}
            />
            <View
              style={styles.header_right}
              onLayout={this._onLayout}
            >
              <Text>
                <Text style={styles.user_text}>
                  {userText}
                </Text>
                {othersText}
              </Text>
              {(others && others.length) ? (
                <View style={styles.others}>
                  { others.map(({ created_by: user }) => (
                    <Avatar
                      key={user.id}
                      uri={user.picture}
                      style={styles.others_avatar}
                      textStyle={styles.others_avatar_text}
                      text={Review.initials(user)}
                      size={18}
                    />
                  )) }
                </View>
              ) : (
                <Text lowercase={!gPlace}>
                  {gPlace ? 'Google' : `was ${status}`}
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
                  (detail || !pictures || !pictures.length) && styles.description_noimage,
                  detail && styles.description_detail,
                ]}
              >
                {shortDescription}
              </Text>
              <Text style={styles.categories}>
                {categories.map(({ id, name }, index) => (
                  <Text key={id} style={styles.categorie}>
                    {`${name}${(index !== categories.length - 1) ? ' · ' : ''}`}
                  </Text>
                ))}
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
    fontWeight: fonts.fontWeight.medium,
  },
  others: {
    flexDirection: 'row',
  },
  others_avatar: {
    marginRight: 2,
    borderWidth: 1,
  },
  others_avatar_text: {
    fontSize: 9,
    lineHeight: 11,
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
    fontWeight: fonts.fontWeight.medium,
    color: colors.greyDark,
  },
  description_noimage: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fonts.fontWeight.regular,
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
