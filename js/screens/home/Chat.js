import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Text from '../../components/Text';

class Chat extends React.PureComponent {
  static propTypes = {
    chats: PropTypes.object,
  }

  render() {
    const { chats } = this.props;

    return (
      <View style={styles.container}>
        {_.map(chats, ({ receiver }, id) => (
          <Text key={id}>{receiver}</Text>
        ))}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  chats: state.chat.chats,
});

export default connect(mapStateToProps, null)(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
