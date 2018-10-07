import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_CHATS_SUCCESS,
} from '../constants/chat';


export function fetchChatsSuccess(chats, removed = false, replace = false) {
  return {
    type: FETCH_CHATS_SUCCESS,
    chats,
    removed,
    replace,
  };
}

export function chatsListener() {
  const query = Firebase.userChats.child(Firebase.userUID());
  const listener = eventChannel((emit) => {
    query.on(
      'child_added',
      data => emit({ [data.key]: data.val() }),
    );
    query.on(
      'child_changed',
      data => emit({ [data.key]: data.val() }),
    );
    query.on(
      'child_removed',
      data => emit({ [data.key]: data.val(), removed: true }),
    );

    return () => query.off();
  });

  return listener;
}
