import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';

class Firebase {
  instance = firebase;

  auth;

  storage;

  database;

  users;

  userChats;

  userContacts;

  initialize(config) {
    this.instance.initializeApp(config);
    this.auth = this.instance.auth;
    this.storage = this.instance.storage;
    this.database = this.instance.database;
    this.users = this.instance.database().ref('users');
    this.messages = this.instance.database().ref('messages');
    this.userChats = this.instance.database().ref('userChats');
    this.userContacts = this.instance.database().ref('userContacts');
  }
}

export default new Firebase();
