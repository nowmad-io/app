import { eventChannel } from 'redux-saga';
import _ from 'lodash';

import Firebase from '../libs/firebase';

import {
  FETCH_FRIENDSHIPS_SUCCESS,
  FETCH_REQUESTS_SUCCESS,
  SEND_NOTIFICATION,
  SEND_REQUEST,
  SEEN_REQUESTS,
} from '../constants/friends';

export function sendNotification(senderId, notificationType) {
  return {
    type: SEND_NOTIFICATION,
    senderId,
    notificationType,
  };
}

export function sendRequest(uid) {
  return {
    type: SEND_REQUEST,
    uid,
  };
}

export function seenRequests() {
  return {
    type: SEEN_REQUESTS,
  };
}

export const apiSeenRequests = (incomings) => {
  const requests = {};

  _.map(incomings, (value, uid) => {
    requests[`/${Firebase.userUID()}/incomings/${uid}/seen`] = true;
  });

  return Firebase.requests.update(requests);
};

export const apiSendRequest = ({
  firstName, lastName, photoURL, senderId,
}) => ({ uid }) => {
  const request = {
    [`/${Firebase.userUID()}/outgoings/${uid}`]: true,
    [`/${uid}/incomings/${Firebase.userUID()}`]: {
      uid: Firebase.userUID(),
      firstName,
      lastName,
      photoURL: photoURL || null,
      senderId,
      seen: false,
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
    },
  };

  return Firebase.requests.update(request);
};

export function apiAcceptRequest(uid) {
  const request = {
    [`/friendships/${Firebase.userUID()}/${uid}`]: true,
    [`/friendships/${uid}/${Firebase.userUID()}`]: true,
    [`/requests/${Firebase.userUID()}/incomings/${uid}`]: null,
    [`/requests/${uid}/outgoings/${Firebase.userUID()}`]: null,
  };
  return Firebase.database().ref().update(request);
}

export function apiRejectRequest(uid) {
  const request = {
    [`/requests/${Firebase.userUID()}/incomings/${uid}`]: null,
    [`/requests/${uid}/outgoings/${Firebase.userUID()}`]: null,
  };
  return Firebase.database().ref().update(request);
}

export function apiCancelRequest(uid) {
  const request = {
    [`/requests/${Firebase.userUID()}/outgoings/${uid}`]: null,
    [`/requests/${uid}/incomings/${Firebase.userUID()}`]: null,
  };
  return Firebase.database().ref().update(request);
}

export function apiFetchUser(uid) {
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
  const query = Firebase.requests.child(uid).orderByChild('timestamp');
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
      data => apiFetchUser(data.key).then(friend => emit({
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
