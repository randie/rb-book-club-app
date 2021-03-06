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
    try {
      // NB: Using firebase cloud function here because we can't
      // query the db directly without being logged in and at this
      // point no user is logged in yet.
      const usernameExistsCallable = this.functions.httpsCallable('usernameExists');
      const { data: usernameExists } = await usernameExistsCallable({ username });
      if (usernameExists) {
        throw new Error(`username ${username} is already taken`);
      }

      const registerUserCallable = this.functions.httpsCallable('registerUser');
      await registerUserCallable({ username, email, password });
    } catch (error) {
      throw error;
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

  createAuthor(name) {
    const createAuthorCallable = this.functions.httpsCallable('createAuthor');
    return createAuthorCallable({ name });
  }

  getAuthors() {
    return this.db.collection('authors').get();
  }

  createBook(book) {
    const createBookCallable = this.functions.httpsCallable('createBook');
    return createBookCallable(book);
  }
}

export default app => new Firebase(app);
