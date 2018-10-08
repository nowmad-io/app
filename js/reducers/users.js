import _ from 'lodash';

import { UPDATE_PROFILE_SUCCESS, FETCH_USERS_SUCCESS, LOGOUT } from '../constants/users';

const initialState = {
  me: null,
  all: {},
  logged: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        me: Object.keys(action.user)[0],
        all: _.merge({}, state.all, action.user),
        logged: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        all: {
          ...state.all,
          ...action.users,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default usersReducer;
