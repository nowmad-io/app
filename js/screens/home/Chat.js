import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Text from '../../components/Text';

export default class Chat extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      id: props.navigation.state.params.id,
    };
  }

  onPress = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { id } = this.state;

    return (
      <View style={styles.container}>
        <Text>YOO CHAT DETAIL !</Text>
        <Text>{ id }</Text>
        <Text onPress={this.onPress}>Back</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
