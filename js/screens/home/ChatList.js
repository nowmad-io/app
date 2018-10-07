import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Text from '../../components/Text';

class ChatList extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    chats: PropTypes.object,
  }

  onChatPress = id => () => {
    this.props.navigation.navigate('Chat', { id });
  }

  render() {
    const { chats } = this.props;

    return (
      <View style={styles.container}>
        {_.map(chats, ({ receiver }, id) => (
          <Text
            key={id}
            onPress={this.onChatPress(id)}
          >
            {receiver}
          </Text>
        ))}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  chats: state.chat.chats,
});

export default connect(mapStateToProps, null)(ChatList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
