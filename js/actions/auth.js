import OneSignal from 'react-native-onesignal';
import _ from 'lodash';

import Firebase from '../libs/firebase';

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

export function apiUpdateProfile({ firstName, lastName, ...profileToUpdate }) {
  const identity = {
    ...(firstName ? { firstName: _.upperFirst(firstName) } : {}),
    ...(lastName ? { lastName: _.upperFirst(lastName) } : {}),
  };

  const profile = {
    ...profileToUpdate,
    ...identity,
  };

  return Firebase.auth().currentUser.updateProfile(profile)
    .then(() => Firebase.users.child(Firebase.userUID()).update({
      ...profile,
      uid: Firebase.userUID(),
    }))
    .then(() => ({
      [Firebase.userUID()]: {
        ...profile,
        uid: Firebase.userUID(),
      },
    }));
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
  return Firebase.auth()
    .createUserWithEmailAndPassword(profile.email, password)
    .then(getSenderId)
    .then(({ userId: senderId }) => {
      OneSignal.sendTag('userId', Firebase.userUID());
      return apiUpdateProfile({
        ...profile,
        senderId,
      });
    });
}

export function logoutSuccess() {
  return { type: LOGOUT };
}

export function apiLogout(dispatch) {
  return Firebase.auth().signOut()
    .then(() => dispatch(logoutSuccess()));
}
