import { UPDATE_PROFILE_SUCCESS, LOGOUT } from '../constants/users';

export const getMe = state => state.users.me;
export const getFriends = state => state.users.friends;

const initialState = {
  me: {},
  logged: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_SUCCESS: {
      const { [Object.keys(action.user)[0]]: me } = action.user;

      return {
        ...state,
        me: {
          ...state.me,
          ...me,
        },
        logged: true,
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default usersReducer;
