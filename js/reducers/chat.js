import { FETCH_CHATS_SUCCESS } from '../constants/chat';
import { LOGOUT } from '../constants/users';

const initialState = {
  chats: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHATS_SUCCESS: {
      return {
        ...state,
        chats: action.chats,
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default chatReducer;
