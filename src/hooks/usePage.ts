import { useState, useEffect } from 'react';
import { db, onSnapshot, doc } from '../firebase';
import { Page } from '../types';

export const usePage = (slug: string) => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'pages', slug), (doc) => {
      if (doc.exists()) {
        setPage({ id: doc.id, ...doc.data() } as Page);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [slug]);

  return { page, loading };
};
