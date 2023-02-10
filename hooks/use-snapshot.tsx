import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';

const useSnapshot = (myCollection: string) => {
  const [value, setValue] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, myCollection), orderBy('timestamp', 'desc')),
        snapshot => setValue(snapshot.docs)
      ),
    [db]
  );

  return {
    value,
  };
};

export default useSnapshot;
