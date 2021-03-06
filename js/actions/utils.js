import {
  RUN_SAGAS,
  STOP_SAGAS,
  FLUSH,
} from '../constants/utils';

export function runSagas() {
  return {
    type: RUN_SAGAS,
  };
}

export function stopSagas() {
  return {
    type: STOP_SAGAS,
  };
}

export function flush() {
  return {
    type: FLUSH,
  };
}
