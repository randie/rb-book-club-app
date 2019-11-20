import firebaseConfig from './config';

let instance = null;
const timestamp = Symbol();

class Firebase {
  constructor(app) {
    if (!instance) {
      app.initializeApp(firebaseConfig);
      //app.analytics();

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
    return newUser.user.updateProfile({ displayName });
  }

  login({ email, password }) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  resetPassword(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  getUserProfile(userId) {
    return this.db
      .collection('profiles')
      .where('userId', '==', userId)
      .get();
  }
}

export default app => new Firebase(app);
