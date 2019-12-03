const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Reference: https://firebase.google.com/docs/functions/write-firebase-functions
//
// For example:
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

/* Take 1
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
/* Take 2
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
    console.log('>>> createProfile', { error, Error: error.Error });
    if (!!error.errorInfo) {
      throw new functions.https.HttpsError('already-exists', error.errorInfo.message);
    } else {
      throw new functions.https.HttpsError('already-exists', 'Registration failed!');
    }
  }
});
*/
exports.createProfile = functions.https.onCall(async (data, context) => {
  // NB: The reason there are multiple try-catch blocks instead of a single one
  // is because the caught error object has a different shape for each error type.

  // check for preconditions: user data is valid and profile does not already exist
  try {
    const validUserData = { username: 'string', email: 'string', password: 'string' };
    isValidData(data, validUserData);
    await profileExistsAlready(data, context);
  } catch (error) {
    throw error;
  }

  // check if profile already exists
  /*
  if (await profileExistsAlready(data, context)) {
    throw new functions.https.HttpsError('already-exists', 'Profile already exists');
  }
  */

  const { username, email, password } = data;
  let newUser;

  // create user account
  try {
    newUser = await admin.auth().createUser({
      email,
      emailVerified: false,
      password,
      displayName: username,
      //photoURL: '',
      disabled: false,
    });
  } catch (error) {
    console.log('>>>', { error });
    throw new functions.https.HttpsError('unknown', error.errorInfo.message);
  }

  // create user profile
  try {
    console.log('>>>', { newUser });
    await admin
      .firestore()
      .collection('profiles')
      .doc(username)
      .set({ userId: newUser.uid });
  } catch (error) {
    console.log('>>>', { error });
    throw new functions.https.HttpsError('unknown', 'Failed to create user profile');
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
    console.log('>>>', 'profileExistsAlready => false');
    throw new functions.https.HttpsError('already-exists', 'Profile already exists for current user');
  }
  */

  // check if there's a profile already for this username
  profile = await profilesCollection.doc(data.username).get();
  if (profile.exists) {
    console.log('>>>', 'profileExistsAlready => false');
    throw new functions.https.HttpsError(
      'already-exists',
      `username ${data.username} already exists`
    );
  }
}
