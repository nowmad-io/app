import { AUTHENTICATE, UPDATE_PROFILE, LOGOUT } from '../constants/auth';
import Api from '../libs/requests';

const initialState = {
  token: null,
  me: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      const { token } = action;

      Api.setAuthorisation(token);
      return {
        ...state,
        token,
      };
    }
    case UPDATE_PROFILE:
      return {
        ...state,
        me: {
          ...state.me,
          ...action.data,
        },
      };
    case LOGOUT:
      Api.setAuthorisation();
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
