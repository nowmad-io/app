import _ from 'lodash';

import { FETCH_CHATS_SUCCESS } from '../constants/chat';
import { LOGOUT } from '../constants/users';

const initialState = {
  chats: {},
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHATS_SUCCESS: {
      let { chats } = state;

      if (action.removed) {
        chats = _.omit(chats, Object.keys(action.chats)[0]);
      } else {
        chats = action.replace ? action.chats : {
          ...chats,
          ...action.chats,
        };
      }

      return {
        ...state,
        chats,
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default chatReducer;
