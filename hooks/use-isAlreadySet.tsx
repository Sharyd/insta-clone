import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const useIsAlreadySet = (
  items: QueryDocumentSnapshot<DocumentData>[] | DocumentData,
  id: string | undefined
) => {
  const [value, setValue] = useState(false);

  useEffect(
    () =>
      setValue(items.findIndex((item: DocumentData) => item?.id === id) !== -1),
    [items, id]
  );

  return {
    value,
  };
};

export default useIsAlreadySet;
