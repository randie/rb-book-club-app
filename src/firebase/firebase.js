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
      this.functions = app.functions();
      this.storage = app.storage();

      this[timestamp] = Date.now();

      instance = this;
    }
    return instance;
  }

  get id() {
    return this[timestamp];
  }

  async register({ email, password, username }) {
    const callable = this.functions.httpsCallable('usernameDoesNotExistYet');
    const usernameDoesNotExistYet = await callable({ username });

    if (usernameDoesNotExistYet) {
      const newUser = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      return this.db
        .collection('profiles')
        .doc(username)
        .set({ userId: newUser.user.uid });
    }
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

  getProfile(userId) {
    return this.db
      .collection('profiles')
      .where('userId', '==', userId)
      .get();
  }

  async getUsername(userId) {
    const profile = await this.getProfile(userId);
    if (profile.empty) return null;
    return profile.docs[0].id;
  }

  subscribeToComments(bookId, callback) {
    const bookRef = this.db.collection('books').doc(bookId);
    return this.db
      .collection('comments')
      .where('book', '==', bookRef)
      .orderBy('dateCreated', 'desc')
      .onSnapshot(callback);
  }

  postComment(bookId, text) {
    const postCommentCallable = this.functions.httpsCallable('postComment');
    return postCommentCallable({ bookId, text });
  }
}

export default app => new Firebase(app);
