import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, BackHandler, Keyboard, View,
} from 'react-native';
import _ from 'lodash';
import shortid from 'shortid';
import Config from 'react-native-config';
import ImagePicker from 'react-native-image-picker';

import { publishReviewEvent } from '../libs/mixpanel';

import Content from '../components/Content';
import Header from '../components/Header';
import Text from '../components/Text';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import RadioButton from '../components/RadioButton';
import Tag from '../components/Tag';
import Label from '../components/Label';
import FormInput from '../components/FormInput';
import ImageHolder from '../components/ImageHolder';
import Icon from '../components/Icon';
import Map from '../components/Map';
import Marker from '../components/Marker';

import { getUid } from '../actions/search';
import { selectPlace } from '../actions/home';
import { pushReview, uploadPictures } from '../actions/entities';
import { selectMarkers, selectReview } from '../reducers/home';

import { colors, fonts, sizes } from '../constants/parameters';

const MAX_LENGTH_PICTURES = 5;
const STATUS = [
  'Travelling here',
  'Living here',
  'Local',
];
const CATEGORIES = [
  'Adventure',
  'Nature shows',
  'Culture',
  'City',
];

class AddReviewScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    place: PropTypes.object,
    review: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const { review, place } = props;

    const defaultReview = {
      shortDescription: place.name || '',
      information: '',
      status: STATUS[0],
      categories: [],
      pictures: place.pictures || [],
      link1: '',
      link2: '',
    };

    this.state = {
      addingImage: false,
      review: {
        ...defaultReview,
        ...review,
      },
      place,
      time: Date.now(),
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  onMapReady = () => {
    const { place: { longitude, latitude } } = this.state;

    this._map.fitToCoordinates([{ latitude, longitude }], { animated: false });
  }

  onPublish = () => {
    const {
      place: {
        uid: placeUid,
        latitude,
        longitude,
        name,
        vicinity,
      },
      review: {
        uid: reviewUid,
        shortDescription,
        information,
        status,
        categories,
        link1,
        link2,
        pictures,
      },
      time,
    } = this.state;
    const newReview = {
      uid: reviewUid || shortid.generate(),
      shortDescription,
      information,
      status,
      categories: _.reduce(categories, (result, value) => ({
        ...result,
        [value]: true,
      }), {}),
      link1,
      link2,
      place: {
        uid: placeUid || getUid({ latitude, longitude }),
        latitude,
        longitude,
        name,
        vicinity,
      },
    };

    Keyboard.dismiss();
    pushReview(newReview);
    this.props.dispatch(selectPlace(newReview.place.uid));
    this.props.dispatch(uploadPictures(newReview.uid, pictures));

    if (!reviewUid) {
      publishReviewEvent({
        vicinity,
        timeSpent: Math.floor((Date.now() - time) / 1000),
        categories: _.join(categories, ', '),
      });
    }
    this.props.navigation.goBack();
  }

  onImageEditBack = ({ image, remove }) => {
    const { review: { pictures } } = this.state;

    this.setState({ addingImage: false });

    if (!image) {
      return;
    }

    if (image && remove) {
      this.setState(({ review }) => ({
        review: {
          ...review,
          pictures: _.filter(pictures, pic => pic.uid !== image.uid),
        },
      }));

      return;
    }

    this.setState(({ review }) => ({
      review: {
        ...review,
        pictures: _.find(pictures, pic => pic.uid === image.uid)
          ? _.map(pictures, (pic) => {
            if (pic.uid === image.uid) {
              return {
                ...pic,
                ...image,
              };
            }

            return pic;
          })
          : [...pictures, image],
      },
    }));
  }

  onAddressLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    this._map.updatePadding({ bottom: height });
  }

  selectPictures = () => {
    const options = {
      quality: 0.5,
      storageOptions: {
        skipBackup: true,
        path: Config.IMAGES_FOLDER,
      },
    };

    this.setState({ addingImage: true });

    ImagePicker.showImagePicker(options, ({
      didCancel, error, uri,
    }) => {
      if (didCancel || error) {
        this.setState({ addingImage: false });
      } else {
        this.navigateToImage({ uri })();
      }
    });
  }

  toggleCategory = category => () => {
    const { review: { categories } } = this.state;

    this.setState(({ review }) => ({
      review: {
        ...review,
        categories: _.find(categories, cat => cat === category)
          ? _.without(categories, category)
          : _.uniq([category, ...review.categories]),
      },
    }));
  }

  navigateToImage = image => () => {
    this.props.navigation.navigate('AddImageScreen', {
      onImageEditBack: this.onImageEditBack,
      image,
    });
  }

  render() {
    const {
      review: {
        uid: reviewUid,
        shortDescription,
        information,
        categories,
        pictures,
        status,
        link1,
        link2,
      },
      place,
      addingImage,
    } = this.state;

    const valid = !!information;

    return (
      <View style={styles.container}>
        <Header
          left={(
            <View style={styles.row}>
              <Button transparent onPress={this.onBackPress} icon="arrow-back" header />
              <Text style={styles.headerText}>{`${!reviewUid ? 'New' : 'Update'} Experience`}</Text>
            </View>
          )}
        />
        <Content style={styles.content}>
          <View style={styles.mapWrapper}>
            <Map
              ref={(ref) => { this._map = ref; }}
              onMapReady={this.onMapReady}
            >
              <Marker
                longitude={place.longitude}
                latitude={place.latitude}
                text={place.text}
                picture={place.picture}
                google={place.google}
              />
            </Map>
            <View style={styles.addressWrapper} onLayout={this.onAddressLayout}>
              <Icon style={styles.addressIcon} name="location-on" />
              <Text style={styles.addressText} numberOfLines={1}>
                {place.vicinity}
              </Text>
            </View>
          </View>
          <View style={styles.reviewWrapper}>
            <FormInput
              defaultValue={shortDescription}
              placeholder="Where were you ?"
              onChangeText={
                short => this.setState(({ review }) => ({
                  review: {
                    ...review,
                    shortDescription: short,
                  },
                }))
              }
              maxLength={50}
            />
            <View>
              <Label text="Tell your friends about your experience" required />
              <FormInput
                defaultValue={information}
                multiline
                placeholder="What made it special ?"
                onChangeText={info => this.setState(({ review }) => ({
                  review: {
                    ...review,
                    information: info,
                  },
                }))}
                maxLength={300}
              />
            </View>
            <View>
              <Label text="You were..." required />
              {STATUS.map(stat => (
                <RadioButton
                  key={shortid.generate()}
                  selected={status === stat}
                  text={stat}
                  onPress={() => this.setState(({ review }) => ({
                    review: {
                      ...review,
                      status: stat,
                    },
                  }))}
                />
              ))}
            </View>
            <View style={styles.group}>
              <Label text="Was it..." />
              <View style={styles.tagWrapper}>
                {CATEGORIES.map(category => (
                  <Tag
                    key={category}
                    text={category}
                    selected={!!_.find(categories, cat => cat === category)}
                    onPress={this.toggleCategory(category)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.group}>
              <Label text="Add some pictures with a caption" />
              <Label subtitle text="You can add your best 5 pictures !" />
              <View style={styles.imagesWrapper}>
                {_.size(pictures) < MAX_LENGTH_PICTURES && (
                  <ImageHolder onPress={this.selectPictures} />
                )}
                { pictures && _.map(pictures, (picture, uid) => (
                  <ImageHolder
                    key={uid}
                    style={styles.image}
                    onPress={this.navigateToImage(picture)}
                    uri={picture.uri}
                  />
                ))}
              </View>
            </View>
            <View style={styles.group}>
              <Label text="Add some links related" />
              <FormInput
                style={styles.linkInput}
                prefixIcon="link"
                defaultValue={link1}
                placeholder="http://..."
                onChangeText={link => this.setState(({ review }) => ({
                  review: {
                    ...review,
                    link1: link,
                  },
                }))}
              />
              {!!link1 && (
                <FormInput
                  style={styles.linkInput}
                  prefixIcon="link"
                  defaultValue={link2}
                  placeholder="http://..."
                  onChangeText={link => this.setState(({ review }) => ({
                    review: {
                      ...review,
                      link2: link,
                    },
                  }))}
                />
              )}
            </View>
          </View>
          <View style={styles.ctaWrapper}>
            <Button
              onPress={this.onPublish}
              disabled={!valid}
              style={styles.ctaButton}
            >
              <Text uppercase={false}>Publish</Text>
            </Button>
          </View>
        </Content>
        <Spinner overlay visible={addingImage} />
      </View>
    );
  }
}

const makeMapStateToProps = () => {
  const markersSelector = selectMarkers();

  return (state, props) => {
    const { reviewId, place } = props.navigation.state.params;

    return {
      review: reviewId ? selectReview(state)(reviewId) : {},
      place: _.isObject(place)
        ? place : _.find(markersSelector(state), { uid: place }),
    };
  };
};

export default connect(makeMapStateToProps)(AddReviewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  mapWrapper: {
    height: 150,
  },
  content: {
    backgroundColor: colors.white,
  },
  group: {
    marginTop: 10,
  },
  addressWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryShadowDark,
  },
  addressIcon: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.white,
    ...fonts.medium,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    paddingLeft: 8,
    color: colors.white,
  },
  reviewWrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tagWrapper: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagesWrapper: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  image: {
    marginLeft: 8,
  },
  headerText: {
    marginLeft: 4,
    ...fonts.medium,
    color: colors.white,
  },
  ctaWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  ctaButton: {
    width: sizes.width * 0.62,
  },
});
