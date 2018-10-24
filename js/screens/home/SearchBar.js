import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput, BackHandler, StyleSheet, View, Animated,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';

import { placeDetails, peopleSearch, placesSearch } from '../../actions/search';
import { selectNotifications } from '../../reducers/friends';

import SearchNavigation from '../../navigation/SearchNavigation';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';

import { rgba, colors, sizes } from '../../constants/parameters';

class SearchBar extends Component {
  search = _.debounce(this.searchDebounced, 300)

  static propTypes = {
    navigation: PropTypes.object,
    onGPlacePress: PropTypes.func,
    children: PropTypes.any,
    onAddFriendPress: PropTypes.func,
    onClear: PropTypes.func,
    notifications: PropTypes.number,
    searchText: PropTypes.string,
  }

  static defaultProps = {
    onClear: () => true,
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      text: '',
      previousValue: '',
      focused: false,
      people: [],
      peopleLoading: false,
      places: [],
      placesLoading: false,
      animation: new Animated.Value(sizes.searchBarPadding),
    };

    this._searchNavigation = React.createRef();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillReceiveProps({ searchText }) {
    if (searchText && searchText !== this.props.searchText) {
      this.blur();
      this.setState({
        text: searchText,
        previousValue: searchText,
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    this.setState(prevState => ({ text: prevState.previousValue }));
    this.blur();
    return true;
  }

  onMenuPress = () => this.props.navigation.openDrawer();

  onFocus = () => {
    Animated.timing(this.state.animation, {
      duration: 200,
      toValue: 0,
    }).start();
    this.setState({ focused: true }, () => this.searchDebounced(this.state.text));
  }

  onChangeText = (text, previous = false) => {
    this.setState({
      text,
      ...(previous ? { previousValue: text } : {}),
    });
    this.search(text);
    this.setState({
      peopleLoading: true,
      placesLoading: true,
    });
  }

  onLeftButtonPress = () => {
    if (this.state.focused) {
      this.onBackPress();
    } else {
      this.focus();
    }
  }

  onClearPress = () => {
    this.setState({ text: '', previousValue: '' });
    this.searchDebounced('');
    this.props.onClear();
  }

  onPlacePress = (place) => {
    this.blur();
    this.onChangeText(place.name, true);
  };

  onAddFriendPress = (friend) => {
    this.props.onAddFriendPress(friend);
  }

  onGPlacePress = (place) => {
    this.setState({ loading: true });

    const action = (fullPlace) => {
      this.setState({
        text: '',
        previousValue: '',
        loading: false,
      });
      this.props.onGPlacePress(fullPlace);
      this.blur();
    };

    if (place.latitude && place.longitude) {
      action(place);
      return;
    }

    placeDetails(place.placeId).then(action);
  }

  onCustomPress = place => this.props.navigation.navigate('AddReviewScreen', { place });

  searchNearby(coordinatesQuery) {
    this.setState({
      peopleLoading: true,
      placesLoading: true,
    });
    this.searchDebounced(coordinatesQuery);
    this.setState({ text: coordinatesQuery });
    this._searchNavigation.current._navigation.navigate('Google Places');
    this.onFocus();
  }

  searchDebounced(query) {
    if (!this.state.focused) {
      return;
    }
    peopleSearch(query)
      .then(people => this.setState({ people, peopleLoading: false }));
    if (query) {
      placesSearch(query)
        .then(places => this.setState({ places, placesLoading: false }));
    } else {
      this.setState({ places: [], placesLoading: false });
    }
  }

  focus() {
    this.setState({ focused: true });
    this.textInput.focus();
  }

  blur() {
    Animated.timing(this.state.animation, {
      duration: 200,
      toValue: sizes.searchBarPadding,
    }).start();
    this.setState({ focused: false, loading: false });
    this.textInput.blur();
  }

  render() {
    const { children, notifications } = this.props;
    const {
      loading,
      text,
      focused,
      people,
      peopleLoading,
      places,
      placesLoading,
      animation,
    } = this.state;
    const searchBarColor = animation.interpolate({
      inputRange: [0, sizes.searchBarPadding],
      outputRange: [rgba(colors.primary), colors.whiteTransparent],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            {
              top: animation,
              left: animation,
              right: animation,
              backgroundColor: searchBarColor,
            },
            !focused && { elevation: 4 },
          ]}
        >
          <Button
            transparent
            style={styles.headerButton}
            iconStyle={!focused && { color: colors.greyDark }}
            onPress={this.onLeftButtonPress}
            icon={focused ? 'arrow-back' : 'search'}
            header
          />

          <TextInput
            ref={(c) => { this.textInput = c; }}
            underlineColorAndroid={focused ? colors.white : colors.transparent}
            autoCorrect={false}
            placeholder="Search for people and places"
            selectionColor={colors.whiteTransparent}
            placeholderTextColor={focused ? colors.white : colors.greyDark}
            style={[
              styles.searchInput,
              !focused && { color: colors.greyDark },
            ]}
            value={text}
            onFocus={this.onFocus}
            onChangeText={this.onChangeText}
            withRef
          />

          { text.length > 0 && (
            <Button
              transparent
              style={styles.headerButton}
              iconStyle={!focused && { color: colors.greyDark }}
              onPress={this.onClearPress}
              icon="close"
              header
            />
          )}
          { (!focused || text.length === 0) && (
            <View>
              <Button
                transparent
                style={styles.headerButton}
                iconStyle={!focused && { color: colors.greyDark }}
                onPress={this.onMenuPress}
                icon="menu"
                header
              />
              {notifications && (
                <Badge
                  style={styles.badge}
                  count={notifications}
                />
              )}
            </View>
          )}
        </Animated.View>
        {children}
        <Animated.View
          style={[
            styles.tabs,
            {
              transform: [{
                translateY: animation.interpolate({
                  inputRange: [0, sizes.searchBarPadding],
                  outputRange: [sizes.headerHeight, sizes.height],
                }),
              }],
            },
          ]}
        >
          <SearchNavigation
            ref={this._searchNavigation}
            screenProps={{
              people,
              peopleLoading,
              places,
              placesLoading,
              text,
              onGPlacePress: this.onGPlacePress,
              onCustomPress: this.onCustomPress,
            }}
          />
          <Spinner overlay visible={loading} />
        </Animated.View>
      </View>
    );
  }
}

const makeMapStateToProps = state => ({
  searchText: state.home.searchText,
  notifications: selectNotifications(state),
});

export default connect(makeMapStateToProps, null, null, { withRef: true })(SearchBar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: sizes.headerHeight,
    zIndex: 9,
  },
  headerButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
  },
  tabs: {
    position: 'absolute',
    top: 0,
    bottom: sizes.toolBar,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 4,
  },
});
