import { useEffect, useState } from 'react';
import firebase from '../firebase';

function useCurrentUser(params) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(user => {
      setCurrentUser(user || null);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { isLoading, currentUser };
}

export default useCurrentUser;
