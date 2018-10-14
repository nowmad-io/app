import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, ScrollView, View,
} from 'react-native';
import _ from 'lodash';

import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';

import { colors, fonts } from '../../constants/parameters';

const MAX_LIST = 3;

class Tab extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    screenProps: PropTypes.object,
    friends: PropTypes.object,
  };

  render() {
    const {
      navigation,
      screenProps: {
        people,
        peopleLoading,
      },
      friends,
    } = this.props;

    const allPage = navigation.state.routeName === 'All';

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          { people && (
            <List
              label={allPage ? 'RESULTS BY PEOPLE' : null}
              style={styles.list}
              action="see all"
              actionDisable={people.length <= MAX_LIST}
              onActionPress={() => navigation.navigate('People')}
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
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  friends: state.entities.friends,
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
});
