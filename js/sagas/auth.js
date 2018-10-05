import {
  put, takeLatest, call, take,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import PictureUpload from '../libs/pictureUpload';

import {
  LOGOUT,
  UPLOAD_PROFILE_PICTURE,
} from '../constants/auth';
import { STOP_SAGAS } from '../constants/utils';

import { apiUpdateProfile, updateProfile } from '../actions/auth';

function* uploadSaga(path) {
  const channel = yield call(() => eventChannel((emit) => {
    PictureUpload.upload(
      path,
      uri => emit({ uri }),
      error => emit({ error }),
    );
    return () => {};
  }));

  const { uri, error } = yield take(channel);

  return { uri, error };
}

function* profileFlow(action) {
  const { firstName, lastName } = action.data;
  let { picture } = action.data;

  if (picture) {
    const { uri, error } = yield uploadSaga(picture);

    if (!error) {
      picture = uri;
    }
  }

  const user = yield call(apiUpdateProfile, {
    first_name: firstName,
    last_name: lastName,
    picture,
  });

  yield put(updateProfile(user));
}

export function* logoutFlow() {
  yield put({ type: STOP_SAGAS });
}

// Bootstrap sagas
export default function* root() {
  yield takeLatest(UPLOAD_PROFILE_PICTURE, profileFlow);
  yield takeLatest(LOGOUT, logoutFlow);
}
