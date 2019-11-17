import { useEffect, useState } from 'react';
import firebase from '../firebase';

function useCurrentUser(params) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(user => setCurrentUser(user || null));
    return () => unsubscribe();
  }, []);

  return currentUser;
}

export default useCurrentUser;
