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

exports.postComment = functions.https.onCall((data, context) => {
  const db = admin.firestore();
  return db
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
    );
});
