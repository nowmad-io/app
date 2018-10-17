import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, ScrollView, View, Image,
} from 'react-native';

import {
  sendFriendRequestNotification,
  sendRequest,
  acceptRequest,
  cancelRequest,
  rejectRequest,
} from '../../actions/friends';

import Text from '../../components/Text';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';

import { colors, fonts } from '../../constants/parameters';

const poweredByGoogle = require('../../../assets/images/powered_by_google.png');
const googleImage = require('../../../assets/images/icons/google.png');

const MAX_LIST = 3;

class Tab extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
    friends: PropTypes.object,
    incomings: PropTypes.object,
    outgoings: PropTypes.object,
  };

  navigate = tab => () => this.props.navigation.navigate(tab);

  onGPlacePress = place => () => this.props.screenProps.onGPlacePress(place);;

  sendFriendRequest = (uid, senderId) => () => {
    sendRequest(uid);
    this.props.dispatch(sendFriendRequestNotification(senderId));
  };

  acceptFriendRequest = uid => () => acceptRequest(uid);

  rejectFriendRequest = uid => () => rejectRequest(uid);

  cancelFriendRequest = uid => () => cancelRequest(uid);

  render() {
    const {
      navigation,
      screenProps: {
        people,
        peopleLoading,
        places,
        placesLoading,
      },
      friends,
      incomings,
      outgoings,
    } = this.props;

    const allPage = navigation.state.routeName === 'All';
    const peoplePage = navigation.state.routeName === 'People';
    const placesPage = navigation.state.routeName === 'Places';

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          { (peoplePage || allPage) && (
            <List
              label={allPage ? 'RESULTS BY PEOPLE' : null}
              style={styles.list}
              action="see all"
              actionDisable={people.length <= MAX_LIST}
              onActionPress={this.navigate('People')}
            >
              <Spinner visible={peopleLoading} />
              {!peopleLoading && (allPage ? people.slice(0, MAX_LIST) : people).map(result => (
                <ListItem
                  key={result.uid}
                  text={`${result.firstName} ${result.lastName}`}
                  thumbnail={result.photoUrl}
                >
                  {!friends[result.uid] && !incomings[result.uid] && !outgoings[result.uid] && (
                    <Button
                      transparent
                      style={{ height: 24, padding: 0 }}
                      iconStyle={styles.icon}
                      icon="person-add"
                      onPress={this.sendFriendRequest(result.uid, result.senderId)}
                    />
                  )}
                  {outgoings[result.uid] && (
                    <Button
                      transparent
                      style={{ height: 24, padding: 0 }}
                      onPress={this.cancelFriendRequest(result.uid)}
                    >
                      <Text style={styles.text}>Cancel</Text>
                    </Button>
                  )}
                  {incomings[result.uid] && (
                    <View style={{ flexDirection: 'row' }}>
                      <Button
                        transparent
                        icon="close"
                        style={styles.requestButton}
                        iconStyle={styles.requestIcon}
                        onPress={this.rejectFriendRequest(result.uid)}
                      />
                      <Button
                        transparent
                        icon="check"
                        style={styles.requestButton}
                        iconStyle={styles.requestIcon}
                        onPress={this.acceptFriendRequest(result.uid)}
                      />
                    </View>
                  )}
                </ListItem>
              ))}
            </List>
          )}
          { (placesPage || allPage) && (
            <List
              label={allPage ? 'RESULTS BY PLACES' : null}
              style={styles.list}
              action="see all"
              actionDisable={places.length <= MAX_LIST}
              onActionPress={this.navigate('Places')}
            >
              <Image source={poweredByGoogle} style={styles.poweredByGoogle} />
              <Spinner visible={placesLoading} />
              {!placesLoading && (allPage ? places.slice(0, MAX_LIST) : places).map(place => (
                <ListItem
                  key={place.placeId}
                  text={place.name}
                  thumbnail={googleImage}
                  thumbnailStyle={styles.thumbnailStyle}
                  onPress={this.onGPlacePress(place)}
                />
              ))}
            </List>
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  friends: state.friends.all,
  incomings: state.friends.incomings,
  outgoings: state.friends.outgoings,
});

export default connect(mapStateToProps)(Tab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    flex: 1,
  },
  list: {
    minHeight: 62,
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
    color: colors.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: fonts.fontWeight.light,
    color: colors.primary,
  },
  requestButton: {
    height: 20,
    width: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestIcon: {
    color: colors.primary,
    fontSize: 14,
  },
  button: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  buttonText: {
    marginRight: 4,
  },
  poweredByGoogle: {
    marginBottom: 12,
  },
  thumbnailStyle: {
    height: 16,
    width: 16,
  },
});
