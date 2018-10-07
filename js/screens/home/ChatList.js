import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Text from '../../components/Text';

class ChatList extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    chats: PropTypes.object,
    users: PropTypes.object,
  }

  onChatPress = id => () => {
    this.props.navigation.navigate('Chat', { id });
  }

  render() {
    const { chats, users } = this.props;

    return (
      <View style={styles.container}>
        {_.map(chats, ({ receiver }, id) => (
          <TouchableOpacity key={id} onPress={this.onChatPress(id)}>
            <Text capitalize>{ users[receiver] && users[receiver].displayName }</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  chats: state.chat.chats,
  users: state.users.all,
});

export default connect(mapStateToProps, null)(ChatList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
