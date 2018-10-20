import { put, takeLatest, call } from 'redux-saga/effects';

import PictureUpload from '../libs/pictureUpload';

import {
  LOGOUT,
  UPDATE_PROFILE,
} from '../constants/auth';

import { apiUpdateProfile, updateProfileSuccess } from '../actions/auth';
import { stopSagas } from '../actions/utils';

function* profileFlow(action) {
  // eslint-disable-next-line prefer-const
  let { photoURL, ...user } = action.user;

  if (photoURL && !photoURL.startsWith('http')) {
    try {
      photoURL = yield call(PictureUpload, photoURL);
    } catch (error) {
      photoURL = null;
    }
  }

  const updatedUser = yield call(apiUpdateProfile, {
    ...user,
    photoURL,
  });

  yield put(updateProfileSuccess(updatedUser));
}

export function* logoutFlow() {
  yield put(stopSagas());
}

// Bootstrap sagas
export default function* root() {
  yield takeLatest(UPDATE_PROFILE, profileFlow);
  yield takeLatest(LOGOUT, logoutFlow);
}
