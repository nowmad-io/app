import Firebase from '../libs/firebase';

import {
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  FETCH_FRIENDSHIPS_SUCCESS,
  LOGOUT,
} from '../constants/users';

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

export function apiUpdateProfile(profile) {
  return Firebase.auth().currentUser.updateProfile(profile)
    .then(() => Firebase.users.child(Firebase.userUID()).update(profile))
    .then(() => ({
      [Firebase.userUID()]: profile,
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

export function apiLogin(email, password) {
  return Firebase.auth()
    .setPersistence('local')
    .then(() => Firebase.auth().signInWithEmailAndPassword(email, password))
    .then(() => Firebase.users.child(Firebase.userUID()).once('value'))
    .then(user => ({
      [Firebase.userUID()]: user.val(),
    }));
}

export function apiRegister({ password, ...profile }) {
  return Firebase.auth()
    .createUserWithEmailAndPassword(profile.email, password)
    .then(() => apiUpdateProfile(profile));
}

export function fetchFriendshipsSuccess(friends) {
  return {
    type: FETCH_FRIENDSHIPS_SUCCESS,
    friends,
  };
}

export function fetchUser(uid) {
  return Firebase.users.child(uid).once('value')
    .then(user => ({
      ...user.val(),
      uid: user.key,
    }));
}

export function fetchFriendships() {
  return Firebase.friendships.child(Firebase.userUID()).once('value')
    .then(friends => friends.val());
}

export function logoutSuccess() {
  return { type: LOGOUT };
}

export function apiLogout(dispatch) {
  return Firebase.auth().signOut()
    .then(() => dispatch(logoutSuccess()));
}
