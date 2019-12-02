const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// For example:
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

/*
exports.createProfile = functions.https.onCall(async (data, context) => {
  try {
    const validProfileData = { username: 'string' };
    if (isAuthenticatedUser(context) && isValidData(data, validProfileData)) {
      if (await profileExistsAlready(data, context)) {
        throw new functions.https.HttpsError('already-exists', 'Profile already exists');
      }

      return admin
        .firestore()
        .collection('profiles')
        .doc(data.username)
        .set({ userId: context.auth.uid });
    }
  } catch (error) {
    throw error;
  }
});
*/
exports.createProfile = functions.https.onCall(async (data, context) => {
  try {
    const validProfileData = { username: 'string', email: 'string', password: 'string' };
    if (isValidData(data, validProfileData)) {
      if (await profileExistsAlready(data, context)) {
        throw new functions.https.HttpsError('already-exists', 'Profile already exists');
      }

      const { username, email, password } = data;
      //const newUser = await admin.auth().createUserWithEmailAndPassword(email, password);
      const newUser = await admin.auth().createUser({
        email,
        emailVerified: false,
        password,
        displayName: username,
        //photoURL: '',
        disabled: false,
      });
      console.log('>>>', { newUser });
      await admin
        .firestore()
        .collection('profiles')
        .doc(username)
        .set({ userId: newUser.uid });
    }
  } catch (error) {
    console.log('>>> createProfile', { error, errorInfo: error.errorInfo });
    throw new functions.https.HttpsError(
      'already-exists',
      `email address ${data.email} already exists`
    );
  }
});

exports.usernameExists = functions.https.onCall(async (data, context) => {
  try {
    const profile = await admin
      .firestore()
      .collection('profiles')
      .doc(data.username)
      .get();

    return profile.exists;
  } catch (error) {
    throw error;
  }
});

exports.postComment = functions.https.onCall((data, context) => {
  const validCommentData = { bookId: 'string', text: 'string' };
  const db = admin.firestore();

  return (
    isAuthenticatedUser(context) &&
    isValidData(data, validCommentData) &&
    db
      .collection('profiles')
      .where('userId', '==', context.auth.uid) // uid of the currently logged in user
      .limit(1)
      .get()
      .then(snapshot =>
        db.collection('comments').add({
          book: db.collection('books').doc(data.bookId),
          text: data.text,
          username: snapshot.docs[0].id,
          dateCreated: new Date(),
        })
      )
    // TODO: catch and handle errors
  );
});

function isAuthenticatedUser(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User is not logged in.');
  }
  return true;
}

function isValidData(data, validData) {
  if (Object.keys(data).length !== Object.keys(validData).length) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Data contains invalid number of properties'
    );
  }
  Object.keys(data).forEach(key => {
    if (!validData.hasOwnProperty(key)) {
      throw new functions.https.HttpsError('invalid-argument', 'Data contains invalid properties');
    }
    if (typeof data[key] !== validData[key]) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Data contains invalid property types'
      );
    }
  });
  return true;
}

async function profileExistsAlready(data, context) {
  const profilesCollection = admin.firestore().collection('profiles');

  let profile;

  // check if there's a profile already for the current user
  /*
  profile = await profilesCollection
    .where('userId', '==', context.auth.uid)
    .limit(1)
    .get();

  if (!profile.empty) {
    return true;
  }
  */

  // check if there's a profile already for the given username
  profile = await profilesCollection.doc(data.username).get();

  if (profile.exists) {
    return true;
  }

  console.log('>>>', 'profileExistsAlready => false');
  return false;
}
