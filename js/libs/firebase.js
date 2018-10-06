import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';

class Firebase {
  instance = firebase;

  auth;

  storage;

  constructor() {
    this.auth = this.instance.auth;
    this.storage = this.instance.storage;
  }

  initialize(config) {
    this.instance.initializeApp(config);
  }
}

export default new Firebase();
