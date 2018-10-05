import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity, View, StyleSheet, Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';

import Icon from './Icon';
import Spinner from './Spinner';
import Button from './Button';

import { colors } from '../constants/parameters';

export default class ProfilePicker extends PureComponent {
  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    onPictureSelected: PropTypes.func,
    uri: PropTypes.string,
  };

  static defaultProps = {
    onPictureSelected: () => true,
  }

  constructor(props) {
    super(props);

    this.state = {
      addingImage: false,
    };
  }

  onPress = () => {
    const options = {
      quality: 0.5,
      storageOptions: {
        skipBackup: true,
        path: Config.IMAGES_FOLDER,
      },
    };

    this.setState({ addingImage: true });

    ImagePicker.showImagePicker(options, ({
      didCancel, error, path, uri,
    }) => {
      this.setState({ addingImage: false });

      if (!didCancel && !error) {
        const newImage = {
          uri,
          path: Platform.OS === 'android' ? path : { path: uri },
        };

        this.props.onPictureSelected(newImage);
      }
    });
  }

  render() {
    const { style, uri } = this.props;
    const { addingImage } = this.state;

    return (
      <View style={styles.helper}>
        <View
          style={[
            styles.wrapper,
            uri && styles.pictureSelected,
            style,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.touchableOpacity}
            onPress={this.onPress}
          >
            {uri ? (
              <FastImage
                style={styles.image}
                source={{ uri }}
              />
            ) : (
              <Icon name="camera-alt" style={styles.icon} />
            )}
          </TouchableOpacity>
          <Spinner overlay visible={addingImage} />
        </View>
        {uri && (
          <Button fab style={styles.button} onPress={this.onPress}>
            <Icon name="camera-alt" style={styles.iconPictureSelected} />
          </Button>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  helper: {
    padding: 4,
  },
  wrapper: {
    height: 152,
    width: 152,
    overflow: 'hidden',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.primaryLight,
  },
  pictureSelected: {
    borderWidth: 0,
  },
  touchableOpacity: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: colors.primary,
    fontSize: 48,
  },
  button: {
    position: 'absolute',
    bottom: -4,
    right: 14,
    elevation: 0,
    width: 41,
    height: 41,
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  iconPictureSelected: {
    color: colors.primary,
    fontSize: 24,
  },
});
