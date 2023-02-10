import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const useSearchUsers = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<DocumentData>([]);
  const [user, loading] = useAuthState(auth);

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'users')), snapshot =>
        setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      ),
    [db]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((userr: { displayName: string; uid: string }) => {
      return userr.displayName.toLowerCase().includes(username.toLowerCase());
    });
  }, [users, username]);

  return {
    filteredUsers,
    setUsername,
    username,
  };
};

export default useSearchUsers;
