import { put, takeLatest, call } from 'redux-saga/effects';

import PictureUpload from '../libs/pictureUpload';

import {
  LOGOUT,
  UPDATE_PROFILE,
} from '../constants/users';

import { apiUpdateProfile, updateProfileSuccess } from '../actions/users';
import { stopSagas } from '../actions/utils';

function* profileFlow(action) {
  let { photoURL } = action.user;

  if (photoURL) {
    try {
      photoURL = yield call(PictureUpload, photoURL);
    } catch (error) {
      photoURL = null;
    }
  }

  const user = yield call(apiUpdateProfile, {
    photoURL,
  });

  yield put(updateProfileSuccess(user));
}

export function* logoutFlow() {
  yield put(stopSagas());
}

// Bootstrap sagas
export default function* root() {
  yield takeLatest(UPDATE_PROFILE, profileFlow);
  yield takeLatest(LOGOUT, logoutFlow);
}
