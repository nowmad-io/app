import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, BackHandler, View } from 'react-native';
import shortid from 'shortid';
import FastImage from 'react-native-fast-image';

import Header from '../components/Header';
import Content from '../components/Content';
import Text from '../components/Text';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Label from '../components/Label';
import FormInput from '../components/FormInput';

import { colors } from '../constants/parameters';

class AddImageScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { image } = props.navigation.state.params;

    this.state = {
      image,
      caption: image.caption || '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onSavePress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onSavePress);
  }

  onSavePress = () => {
    const { navigation } = this.props;

    navigation.state.params.onImageEditBack({
      image: {
        uid: shortid.generate(),
        ...this.state.image,
        caption: this.state.caption,
      },
    });
    navigation.goBack();

    return true;
  }

  onDeletePress = () => {
    const { navigation } = this.props;

    navigation.goBack();
    navigation.state.params.onImageEditBack({
      image: this.state.image,
      remove: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          left={(
            <Button transparent onPress={this.onSavePress} icon="arrow-back" header />
          )}
          right={(
            <Button transparent onPress={this.onSavePress}>
              <Text>
                SAVE
              </Text>
            </Button>
          )}
        />
        <Content style={styles.content}>
          <View>
            <Label text="What is happening in this picture ?" required />
            <FormInput
              placeholder="E.g: The water mirror of Bordeaux"
              defaultValue={this.state.caption}
              onChangeText={caption => this.setState({ caption })}
              maxLength={30}
            />
          </View>
          <View
            style={styles.imageWrapper}
          >
            <FastImage
              style={styles.image}
              source={{ uri: this.state.image.uri }}
            />
          </View>
          <View
            style={styles.actionsWrapper}
          >
            <Icon
              style={styles.icon}
              name="delete"
              onPress={this.onDeletePress}
            />
          </View>
        </Content>
      </View>
    );
  }
}

export default AddImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    backgroundColor: colors.white,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  imageWrapper: {
    marginTop: 14,
  },
  image: {
    height: 400,
    width: '100%',
  },
  actionsWrapper: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconHeader: {
    color: colors.white,
  },
  icon: {
    color: colors.grey,
  },
});
