import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import { FETCH_FRIENDSHIPS_SUCCESS } from '../constants/friends';

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

// eslint-disable-next-line import/prefer-default-export
export function friendshipsListener(uid) {
  const query = Firebase.friendships.child(uid);
  const listener = eventChannel((emit) => {
    query.on(
      'child_added',
      (data) => {
        console.log('data.key', data.key);
        fetchUser(data.key).then(emit);
      },
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
