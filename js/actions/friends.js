import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_FRIENDSHIPS_SUCCESS,
  FETCH_REQUESTS_SUCCESS,
  SEND_FRIEND_REQUEST_NOTIFICATION,
} from '../constants/friends';

export function sendFriendRequestNotification(senderId) {
  return {
    type: SEND_FRIEND_REQUEST_NOTIFICATION,
    senderId,
  };
}

export function sendRequest(uid) {
  const request = {
    [`/${Firebase.userUID()}/outgoings/${uid}`]: true,
    [`/${uid}/incomings/${Firebase.userUID()}`]: true,
  };

  return Firebase.requests.update(request);
}

export function acceptRequest(uid) {
  const request = {
    [`/friendships/${Firebase.userUID()}/${uid}`]: true,
    [`/friendships/${uid}/${Firebase.userUID()}`]: true,
    [`/requests/${Firebase.userUID()}/incomings/${uid}`]: null,
    [`/requests/${uid}/outgoings/${Firebase.userUID()}`]: null,
  };
  return Firebase.database().ref().update(request);
}

export function rejectRequest(uid) {
  const request = {
    [`/requests/${Firebase.userUID()}/incomings/${uid}`]: null,
    [`/requests/${uid}/outgoings/${Firebase.userUID()}`]: null,
  };
  return Firebase.database().ref().update(request);
}

export function cancelRequest(uid) {
  const request = {
    [`/requests/${Firebase.userUID()}/outgoings/${uid}`]: null,
    [`/requests/${uid}/incomings/${Firebase.userUID()}`]: null,
  };
  return Firebase.database().ref().update(request);
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
