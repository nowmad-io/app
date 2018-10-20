import {
  FETCH_FRIENDSHIPS_SUCCESS,
  FETCH_REQUESTS_SUCCESS,
} from '../constants/friends';
import { LOGOUT } from '../constants/auth';

export const getFriends = state => state.friends.all;

const initialState = {
  all: {},
  incomings: {},
  outgoings: {},
};

const friendsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FRIENDSHIPS_SUCCESS:
      return {
        ...state,
        all: {
          ...state.all,
          ...action.friends,
        },
      };
    case FETCH_REQUESTS_SUCCESS: {
      const { incomings, outgoings, removed } = action.requests;

      return {
        ...state,
        incomings: !removed ? (incomings || state.incomings) : {},
        outgoings: !removed ? (outgoings || state.outgoings) : {},
      };
    }
    case `${LOGOUT}_REQUEST`:
      return initialState;
    default:
      return state;
  }
};

export default friendsReducer;
