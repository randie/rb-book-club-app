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

exports.usernameDoesNotExistYet = functions.https.onCall(
  async (data, context) => {
    const profile = await admin
      .firestore()
      .collection('profiles')
      .doc(data.username)
      .get();

    if (profile.exists) {
      throw new functions.https.HttpsError(
        'already-exists',
        `username ${data.username} already exists`
      );
    }

    return true;
  }
);

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
    throw new functions.https.HttpsError(
      'unauthenticated',
      'ERROR! User is not logged in.'
    );
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
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Data contains invalid properties'
      );
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
