const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mimeTypes = require('mimetypes');

// Reference: https://firebase.google.com/docs/functions/write-firebase-functions
//
// For example:
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

exports.createAuthor = functions.https.onCall(async (data, context) => {
  try {
    // check preconditions
    isAuthenticatedUser(context);
    isAdminUser(context);
    const validAuthorData = { name: 'string' };
    isValidData(data, validAuthorData);

    // check that this author doesn't already exist
    const author = await admin
      .firestore()
      .collection('authors')
      .where('name', '==', data.name) // TODO: make this case-insensitive
      .limit(1)
      .get();

    if (!author.empty) {
      throw new functions.https.HttpsError('already-exists', `Author ${data.name} already exists`);
    }

    // and finally, add author
    return admin
      .firestore()
      .collection('authors')
      .add({ name: data.name });
  } catch (error) {
    throw error;
  }
});

exports.createBook = functions.https.onCall(async (data, context) => {
  const { title, authorId, summary, imageBlob } = data;

  // check preconditions
  isAuthenticatedUser(context);
  isAdminUser(context);
  const validBookData = {
    title: 'string',
    authorId: 'string',
    summary: 'string',
    imageBlob: 'string',
  };
  isValidData(data, validBookData);

  // save image to firebase storage
  const mimeType = imageBlob.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
  const base64EncodedImageString = imageBlob.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = new Buffer(base64EncodedImageString, 'base64');
  const name = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
  const filename = `images/${name}.${mimeTypes.detectExtension(mimeType)}`;
  const file = admin
    .storage()
    .bucket()
    .file(filename);
  await file.save(imageBuffer, { contentType: 'image/jpeg' });

  const imageUrl = await file
    .getSignedUrl({ action: 'read', expires: '03-09-2491' })
    .then(urls => urls[0]);
  const author = admin
    .firestore()
    .collection('authors')
    .doc(authorId);

  return admin
    .firestore()
    .collection('books')
    .add({ title, summary, imageUrl, author });
});

exports.registerUser = functions.https.onCall(async (data, context) => {
  // NB: The reason there are multiple try-catch blocks instead of a single one
  // is because the error object has a different shape for each error case.

  // check for preconditions: profile does not already exist and user data is valid
  try {
    await profileDoesNotExist(data, context);

    const validUserData = { username: 'string', email: 'string', password: 'string' };
    isValidData(data, validUserData);
  } catch (error) {
    throw error;
  }

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

    // NB: accounts.admin firebase environment variable must have
    // already been set from the command line, like so for example:
    //   firebase functions:config:set accounts.admin="admin@example.com"
    const accounts = functions.config().accounts;
    if (accounts && newUser.email === accounts.admin) {
      await admin.auth().setCustomUserClaims(newUser.uid, { admin: true });
    }
  } catch (error) {
    console.log('>>>', { error });
    const message = (error.errorInfo && error.errorInfo.message) || 'Failed to create user account';
    throw new functions.https.HttpsError('unknown', message);
  }

  // create user profile
  try {
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
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }
  return true;
}

function isAdminUser(context) {
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'User must be an admin.');
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

async function profileDoesNotExist(data, context) {
  const profilesCollection = admin.firestore().collection('profiles');

  let profile;

  // check if there's a profile already for the current user
  /*
  profile = await profilesCollection
    .where('userId', '==', context.auth.uid)
    .limit(1)
    .get();

  if (!profile.empty) {
    throw new functions.https.HttpsError('already-exists', 'Profile already exists for current user');
  }
  */

  // check if there's a profile already for this username
  profile = await profilesCollection.doc(data.username).get();
  if (profile.exists) {
    throw new functions.https.HttpsError(
      'already-exists',
      `username ${data.username} already exists`
    );
  }
}
