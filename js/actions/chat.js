import Firebase from '../libs/firebase';

import {
  FETCH_CHATS_SUCCESS,
} from '../constants/chat';


export function fetchChatsSuccess(chats) {
  return {
    type: FETCH_CHATS_SUCCESS,
    chats,
  };
}

export function fetchChats() {
  return Firebase.userChats.child(Firebase.auth().currentUser.uid).once('value')
    .then(chats => chats.val());
}
