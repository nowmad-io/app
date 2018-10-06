import { SESSION_SUCCESS, LOGOUT } from '../constants/auth';

const initialState = {
  user: {},
  logged: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_SUCCESS:
      return {
        ...state,
        user: action.user,
        logged: true,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
