import Firebase from '../libs/firebase';

import { SESSION_SUCCESS, UPDATE_PROFILE, LOGOUT } from '../constants/auth';

export function sessionSuccess(user) {
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
    .then(() => Firebase.auth().currentUser);
}

export function restoreSession() {
  return Firebase.auth().onAuthStateChanged();
}

export function apiLogin(email, password) {
  return Firebase.auth()
    .setPersistence('local')
    .then(() => Firebase.auth().signInWithEmailAndPassword(email, password))
    .then(() => Firebase.auth().currentUser);
}

export function apiRegister(auth, profile) {
  return Firebase.auth()
    .createUserWithEmailAndPassword(auth.email, auth.password)
    .then(() => apiUpdateProfile(profile));
}

export function logout() {
  return { type: LOGOUT };
}

export function apiLogout(dispatch) {
  return Firebase.auth().signOut()
    .then(() => dispatch(logout()));
}
