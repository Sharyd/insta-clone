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

const useSnapshotIDAndOrderBy = (
  firstCollection: string,
  id: string,
  secondCollection: string
) => {
  const [value, setValue] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, firstCollection, id, secondCollection),
          orderBy('timestamp', 'desc')
        ),
        snapshot => setValue(snapshot.docs)
      ),
    [db]
  );

  return {
    value,
  };
};

export default useSnapshotIDAndOrderBy;
