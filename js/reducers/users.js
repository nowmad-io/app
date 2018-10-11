import _ from 'lodash';

import { UPDATE_PROFILE_SUCCESS, FETCH_FRIENDSHIPS_SUCCESS, LOGOUT } from '../constants/users';

export const getMe = state => state.users.me;
export const getFriends = state => state.users.friends;

const initialState = {
  me: {},
  friends: {},
  logged: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        me: {
          uid: Object.keys(action.user)[0],
          ...action.user[Object.keys(action.user)[0]],
        },
        friends: _.merge({}, state.all, action.user),
        logged: true,
      };
    case FETCH_FRIENDSHIPS_SUCCESS:
      return {
        ...state,
        friends: {
          ...state.friends,
          ...action.friends,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default usersReducer;
