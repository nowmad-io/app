import OneSignal from 'react-native-onesignal';
import _ from 'lodash';

import Firebase from '../libs/firebase';
import {
  identifyEvent,
  setProfile,
  registerSuperProperties,
  loginEvent,
  registerEvent,
} from '../libs/mixpanel';

import {
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  LOGOUT,
} from '../constants/auth';

export function updateProfileSuccess(user) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    user,
  };
}

export function updateProfile(user) {
  return {
    type: UPDATE_PROFILE,
    user,
  };
}

function updateAuthProfile({ firstName, lastName, ...profileToUpdate }) {
  const identity = {
    ...(firstName ? { firstName: _.upperFirst(firstName) } : {}),
    ...(lastName ? { lastName: _.upperFirst(lastName) } : {}),
  };

  const profile = {
    ...profileToUpdate,
    ...identity,
  };

  return Firebase.auth().currentUser.updateProfile(profile)
    .then(() => profile);
}

export function apiUpdateProfile(profile) {
  return updateAuthProfile(profile)
    .then(myProfile => Firebase.users.child(Firebase.userUID()).update(myProfile)
      .then(() => ({ [Firebase.userUID()]: profile })));
}

export function apiRestoreSession() {
  return new Promise((resolve) => {
    const unsubscribe = Firebase.auth().onAuthStateChanged(() => {
      unsubscribe();
      resolve();
    });
  });
}

function getSenderId() {
  return new Promise(resolve => OneSignal.getPermissionSubscriptionState(resolve));
}

export function apiLogin(email, password) {
  loginEvent();
  return Firebase.auth()
    .setPersistence('local')
    .then(() => Firebase.auth().signInWithEmailAndPassword(email, password))
    .then(getSenderId)
    .then(({ userId: senderId }) => apiUpdateProfile({ senderId }))
    .then(() => {
      OneSignal.sendTag('userId', Firebase.userUID());
      return Firebase.users.child(Firebase.userUID()).once('value');
    })
    .then(user => ({
      [Firebase.userUID()]: user.val(),
    }));
}

export function apiRegister({ password, ...profile }) {
  identifyEvent(profile.email);
  registerEvent(profile);
  registerSuperProperties(profile);
  setProfile(profile);

  return Firebase.auth()
    .createUserWithEmailAndPassword(profile.email, password)
    .then(getSenderId)
    .then(({ userId: senderId }) => {
      const uid = Firebase.userUID();
      const myProfile = {
        ...profile,
        uid,
        senderId,
      };
      const requests = {
        [`/users/${uid}`]: myProfile,
        [`/reviews/${uid}`]: true,
        [`/friendships/${uid}`]: true,
        [`/requests/${uid}`]: true,
      };

      OneSignal.sendTag('userId', uid);

      return updateAuthProfile(myProfile)
        .then(() => Firebase.database().ref().update(requests))
        .then(() => ({ [uid]: myProfile }));
    });
}

export function logoutSuccess() {
  return { type: LOGOUT };
}

export function apiLogout(dispatch) {
  return Firebase.auth().signOut()
    .then(() => dispatch(logoutSuccess()));
}
