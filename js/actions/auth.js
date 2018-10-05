import Api from '../libs/requests';

import { AUTHENTICATE, LOGOUT } from '../constants/auth';

export function apiLogin(data) {
  return Api.post('auth/token/create/', { params: data });
}

export function apiRegister(data) {
  return Api.post('auth/register/', { params: data });
}

export function apiLogout(dispatch) {
  dispatch({ type: LOGOUT });
  return Api.get('auth/token/destroy/').catch(() => true);
}

export function authenticate(token) {
  return {
    type: AUTHENTICATE,
    token,
  };
}
