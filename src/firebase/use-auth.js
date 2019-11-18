import { useEffect, useState } from 'react';
import getFirebase from '../firebase';

const getFirebaseDependencies = () =>
  Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
    // import('firebase/functions'),
    // import('firebase/storage'),
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

      unsubscribe = firebaseInstance.auth.onAuthStateChanged(user => {
        setCurrentUser(user || null);
        setIsLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  return { firebase, isLoading, currentUser };
}

export default useAuth;
