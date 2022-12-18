import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const useSnapshot = () => {
  const [value, setValue] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        snapshot => setValue(snapshot.docs)
      ),
    [db]
  );

  return {
    value,
  };
};

export default useSnapshot;
