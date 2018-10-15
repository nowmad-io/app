import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, ScrollView, View, Image,
} from 'react-native';
import _ from 'lodash';

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
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
    friends: PropTypes.object,
  };

  navigate = tab => () => this.props.navigation.navigate(tab);

  onNearbyPress = place => () => this.props.screenProps.onNearbyPress(place);;

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
                  text={`${_.upperFirst(result.firstName)} ${_.upperFirst(result.lastName)}`}
                  thumbnail={result.photoUrl}
                >
                  { !friends[result.uid] && (
                    <Button
                      transparent
                      style={{ height: 24, padding: 0 }}
                      iconStyle={styles.icon}
                      icon="person-add"
                    />
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
                  onPress={this.onNearbyPress(place)}
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
