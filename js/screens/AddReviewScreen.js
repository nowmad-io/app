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

import { pushReview, uploadPictures } from '../actions/entities';
import { selectMarkers, selectReview } from '../reducers/home';

import { colors } from '../constants/parameters';

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
      shortDescription: '',
      information: '',
      status: STATUS[0],
      categories: {},
      pictures: {},
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

    this._map.animateToCoordinate({ latitude, longitude });
  }

  onPublish = () => {
    const {
      place: {
        uid: placeUid,
        latitude,
        longitude,
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
    } = this.state;
    const newReview = {
      uid: reviewUid || shortid.generate(),
      shortDescription,
      information,
      status,
      categories,
      link1,
      link2,
      place: {
        uid: placeUid,
        latitude,
        longitude,
      },
    };
    Keyboard.dismiss();
    pushReview(newReview);
    this.props.dispatch(uploadPictures(newReview.uid, pictures));
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
          pictures: _.omit(pictures, image.uid),
        },
      }));

      return;
    }

    this.setState(({ review }) => ({
      review: {
        ...review,
        pictures: {
          ...review.pictures,
          [image.uid]: {
            ...review.pictures[image.uid],
            ...image,
          },
        },
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
        categories: categories[category]
          ? _.omit(categories, category)
          : {
            ...review.categories,
            [category]: true,
          },
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

    const valid = !!shortDescription;

    return (
      <View style={styles.container}>
        <Header
          left={(
            <Button transparent onPress={this.onBackPress} icon="arrow-back" header />
          )}
          right={(
            <Button transparent onPress={this.onPublish} disabled={!valid}>
              <Text>
                PUBLISH
              </Text>
            </Button>
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
              <Text style={styles.addressText}>
                {place.address}
              </Text>
            </View>
          </View>
          <View style={styles.reviewWrapper}>
            <Text style={styles.title}>
              My review
            </Text>
            <View>
              <Label
                text="Add a short description about this place"
                required
              />
              <FormInput
                defaultValue={shortDescription}
                placeholder="E.g: Beautiful water mirror ! Chill and peaceful..."
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
            </View>
            <View style={styles.group}>
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
                    selected={categories[category]}
                    onPress={this.toggleCategory(category)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.group}>
              <Label text="Tell your friends about your experience" />
              <FormInput
                defaultValue={information}
                multiline
                placeholder="What made that experience mad awesome ?"
                onChangeText={info => this.setState(({ review }) => ({
                  review: {
                    ...review,
                    information: info,
                  },
                }))}
                maxLength={300}
              />
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
    backgroundColor: colors.whiteTransparent,
  },
  addressIcon: {
    fontSize: 14,
    color: colors.grey,
  },
  addressText: {
    fontSize: 10,
    marginLeft: 8,
  },
  reviewWrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    lineHeight: 26,
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
  imagesCaption: {
    fontSize: 14,
    fontWeight: '400',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  icon: {
    color: colors.white,
  },
});
