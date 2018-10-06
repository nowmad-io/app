import Firebase from '../libs/firebase';

import {
  SESSION_SUCCESS,
  UPDATE_PROFILE,
  FETCH_USERS_SUCCESS,
  LOGOUT,
} from '../constants/users';

export function updateProfileSuccess(user) {
  return {
    type: SESSION_SUCCESS,
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
    .then(() => Firebase.users.child(Firebase.auth().currentUser.uid).update(profile))
    .then(() => profile);
}

export function apiLogin(email, password) {
  return Firebase.auth()
    .setPersistence('local')
    .then(() => Firebase.auth().signInWithEmailAndPassword(email, password))
    .then(() => Firebase.users.child(Firebase.auth().currentUser.uid).once('value'))
    .then((user) => {
      const me = {};
      me[Firebase.auth().currentUser.uid] = user.val();

      return me;
    });
}

export function apiRegister({ password, ...profile }) {
  return Firebase.auth()
    .createUserWithEmailAndPassword(profile.email, password)
    .then(() => apiUpdateProfile(profile));
}

export function fetchUsersSuccess(users) {
  return {
    type: FETCH_USERS_SUCCESS,
    users,
  };
}

export function fetchUsers() {
  return Firebase.users.once('value')
    .then(users => users.val());
}

export function logoutSuccess() {
  return { type: LOGOUT };
}

export function apiLogout(dispatch) {
  return Firebase.auth().signOut()
    .then(() => dispatch(logoutSuccess()));
}
