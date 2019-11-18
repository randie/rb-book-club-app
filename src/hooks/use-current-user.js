import { useEffect, useState } from 'react';
import getFirebase from '../firebase';
import loadFirebaseDependencies from '../firebase/loadFirebaseDependencies';

function useCurrentUser(params) {
  const [firebase, setFirebase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let unsubscribe;

    loadFirebaseDependencies().then(app => {
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

export default useCurrentUser;
