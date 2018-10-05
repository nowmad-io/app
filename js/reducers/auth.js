import { AUTHENTICATE } from '../constants/auth';
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
    default:
      return state;
  }
};

export default authReducer;
