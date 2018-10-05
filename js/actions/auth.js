import Api from '../libs/requests';

import { AUTHENTICATE } from '../constants/auth';

export function apiLogin(data) {
  return Api.post('auth/token/create/', { params: data });
}

export function apiRegister(data) {
  return Api.post('auth/register/', { params: data });
}

export function authenticate(token) {
  return {
    type: AUTHENTICATE,
    token,
  };
}
