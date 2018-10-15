import {
  FETCH_FRIENDSHIPS_SUCCESS,
} from '../constants/friends';
import { UPDATE_PROFILE_SUCCESS, LOGOUT } from '../constants/auth';

export const getFriends = state => state.friends.all;

const initialState = {
  all: [],
  incomings: [],
  outgoings: [],
};

const friendsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_SUCCESS: {
      const { [Object.keys(action.user)[0]]: me } = action.user;

      return {
        ...state,
        all: {
          ...state.all,
          [me.uid]: {
            ...(state.all[me.uid] || {}),
            ...me,
          },
        },
      };
    }
    case FETCH_FRIENDSHIPS_SUCCESS:
      return {
        ...state,
        all: {
          ...state.all,
          ...action.friends,
        },
      };
    case `${LOGOUT}_REQUEST`:
      return initialState;
    default:
      return state;
  }
};

export default friendsReducer;
