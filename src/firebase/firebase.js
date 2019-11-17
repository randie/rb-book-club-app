import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import firebaseConfig from './config';

let instance = null;
const timestamp = Symbol();

class Firebase {
  constructor() {
    if (!instance) {
      app.initializeApp(firebaseConfig);
      app.analytics();

      this.auth = app.auth();
      this.db = app.firestore();
      this[timestamp] = Date.now();

      instance = this;
    }
    return instance;
  }

  get id() {
    return this[timestamp];
  }

  async register({ email, password, displayName }) {
    const newUser = await this.auth.createUserWithEmailAndPassword(email, password);
    return await newUser.user.updateProfile({ displayName });
  }

  async login({ email, password }) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut();
  }

  async resetPassword(email) {
    await this.auth.sendPasswordResetEmail(email);
  }
}

const firebase = new Firebase();

export default firebase;
