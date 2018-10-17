import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput, BackHandler, StyleSheet, View,
} from 'react-native';
import _ from 'lodash';

import { placeDetails, peopleSearch, placesSearch } from '../../actions/search';

import SearchNavigation from '../../navigation/SearchNavigation';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';

import { colors, sizes } from '../../constants/parameters';

export default class SearchBar extends Component {
  search = _.debounce(this.searchDebounced, 300)

  static propTypes = {
    navigation: PropTypes.object,
    onGPlacePress: PropTypes.func,
    children: PropTypes.any,
    onAddFriendPress: PropTypes.func,
    onClear: PropTypes.func,
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
    };

    this._searchNavigation = React.createRef();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
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
    this.setState({ focused: true });
    this.searchDebounced(this.state.text);
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

  onFriendPress = (friend) => {
    this.blur();
    this.onChangeText(friend.first_name, true);
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

  searchNearby(coordinatesQuery) {
    this.setState({
      peopleLoading: true,
      placesLoading: true,
    });
    this.searchDebounced(coordinatesQuery);
    this.setState({ text: coordinatesQuery });
    this._searchNavigation.current._navigation.navigate('Places');
    this.setState({ focused: true });
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
    this.setState({ focused: false, loading: false });
    this.textInput.blur();
  }

  render() {
    const { children } = this.props;
    const {
      loading,
      text,
      focused,
      people,
      peopleLoading,
      places,
      placesLoading,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header>
          <Button
            transparent
            style={styles.headerButton}
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
            placeholderTextColor={colors.white}
            style={styles.searchInput}
            value={text}
            onFocus={this.onFocus}
            onChangeText={this.onChangeText}
            withRef
          />

          { text.length > 0 && (
            <Button
              transparent
              style={styles.headerButton}
              onPress={this.onClearPress}
              icon="close"
              header
            />
          )}
          { (!focused || text.length === 0) && (
            <Button
              transparent
              style={styles.headerButton}
              onPress={this.onMenuPress}
              icon="menu"
              header
            />
          )}
        </Header>
        {children}
        <View
          style={[
            styles.tabs,
            focused && { top: sizes.headerHeight },
          ]}
        >
          <SearchNavigation
            ref={this._searchNavigation}
            screenProps={{
              people,
              peopleLoading,
              places,
              placesLoading,
              onGPlacePress: this.onGPlacePress,
            }}
          />
          <Spinner overlay visible={loading} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    ...StyleSheet.absoluteFillObject,
    top: sizes.height,
    backgroundColor: colors.white,
  },
});
