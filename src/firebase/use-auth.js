import { useEffect, useState } from 'react';
import getFirebase from '../firebase';

const getFirebaseDependencies = () =>
  Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
    import('firebase/functions'),
    import('firebase/storage'),
  ]).then(dependencies => {
    return dependencies[0];
  });

function useAuth() {
  const [firebase, setFirebase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let unsubscribe;

    getFirebaseDependencies().then(app => {
      const firebaseInstance = getFirebase(app);
      setFirebase(firebaseInstance);

      unsubscribe = firebaseInstance.auth.onAuthStateChanged(async user => {
        if (!user) {
          setCurrentUser(null);
        } else {
          const username = await firebaseInstance.getUsername(user.uid);
          const token = await firebaseInstance.auth.currentUser.getIdTokenResult(true); // true => forceRefresh
          setCurrentUser({ ...user, username, isAdmin: token.claims.admin });
        }
        setIsLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  return { firebase, isLoading, currentUser };
}

export default useAuth;
