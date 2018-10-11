import _ from 'lodash';

import { FETCH_USER_REVIEWS_SUCCESS } from '../constants/entities';
import { LOGOUT } from '../constants/users';

const initialState = {
  reviews: {},
  places: {},
};

const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REVIEWS_SUCCESS:
      return {
        ...state,
        reviews: !action.removed ? {
          ...state.reviews,
          ...action.reviews,
        } : _.omit(state.reviews, Object.keys(action.reviews)[0]),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default entitiesReducer;
