import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

interface Props {
  firstDependency: string;
  secondDependency: string;
}

const useSnapshotWhere = (firstDepency: string, secondDependency: string) => {
  const [value, setValue] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  //   useEffect(
  //     () =>
  //       onSnapshot(
  //         query(collection(db, 'users'), where('uid', '==', loggedUser?.uid)),
  //         snapshot =>
  //           setValue(snapshot.docs.flatMap(user => user.data().following))
  //       ),
  //     [db, firstDepency, secondDependency]
  //   );
  return '';
};

export default useSnapshotWhere;
