import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_FRIENDSHIPS_SUCCESS,
  FETCH_REQUESTS_SUCCESS,
} from '../constants/friends';

export function sendRequest(uid) {
  return Firebase.requests.child(Firebase.userUID()).child('outgoings').set({
    [uid]: true,
  });
}

export function fetchUser(uid) {
  return Firebase.users.child(uid).once('value')
    .then(user => ({
      ...user.val(),
      uid: user.key,
    }));
}


export function fetchRequestsSuccess(requests) {
  return {
    type: FETCH_REQUESTS_SUCCESS,
    requests,
  };
}

// eslint-disable-next-line import/prefer-default-export
export function requestsListener(uid) {
  const query = Firebase.requests.child(uid);
  const listener = eventChannel((emit) => {
    query.on(
      'child_added',
      data => emit({
        [data.key]: data.val(),
      }),
    );
    query.on(
      'child_changed',
      data => emit({
        [data.key]: data.val(),
      }),
    );

    return () => query.off();
  });

  return listener;
}

export function fetchFriendshipsSuccess(friends) {
  return {
    type: FETCH_FRIENDSHIPS_SUCCESS,
    friends,
  };
}

// eslint-disable-next-line import/prefer-default-export
export function friendshipsListener(uid) {
  const query = Firebase.friendships.child(uid);
  const listener = eventChannel((emit) => {
    query.on(
      'child_added',
      data => fetchUser(data.key).then(friend => emit({
        [friend.uid]: friend,
      })),
    );
    query.on(
      'child_removed',
      data => emit({
        [data.key]: data.val(),
        removed: true,
      }),
    );

    return () => query.off();
  });

  return listener;
}
