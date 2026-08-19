import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface ExamCatalogItem {
  exam_id: string;
  name: string;
  price: number;
  currency: string;
}

export interface ExamAccess {
  purchasedExamIds: string[];
  hasAllAccess: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  catalog: ExamCatalogItem[];
  hasAccess: (examId: string) => boolean;
  priceFor: (examId: string) => number | null;
  buyExam: (examId: string) => Promise<void>;
  refresh: () => void;
}

export function useExamAccess(): ExamAccess {
  const [purchasedExamIds, setPurchasedExamIds] = useState<string[]>([]);
  const [hasAllAccess, setHasAllAccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState<ExamCatalogItem[]>([]);

  const load = useCallback(() => {
    setLoading(true);
    const token = typeof window !== 'undefined' && window.localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    const catalogReq = api.get('/purchases/catalog').then((res) => setCatalog(res.data)).catch(() => {});
    const accessReq = token
      ? api
          .get('/purchases/me')
          .then((res) => {
            setPurchasedExamIds(res.data.purchased_exam_ids || []);
            setHasAllAccess(!!res.data.has_all_access);
          })
          .catch((err) => {
            if (err?.response?.status === 401) setIsLoggedIn(false);
          })
      : Promise.resolve();

    Promise.all([catalogReq, accessReq]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasAccess = useCallback(
    (examId: string) => hasAllAccess || purchasedExamIds.includes(examId.toLowerCase()),
    [hasAllAccess, purchasedExamIds]
  );

  const priceFor = useCallback(
    (examId: string) => catalog.find((c) => c.exam_id === examId.toLowerCase())?.price ?? null,
    [catalog]
  );

  const buyExam = useCallback(
    async (examId: string) => {
      try {
        const res = await api.post('/purchases', { exam_id: examId.toLowerCase() });
        const { checkout_url } = res.data;
        if (checkout_url) {
          // Redirect to Stripe Checkout
          window.location.href = checkout_url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (error) {
        console.error('Failed to start checkout:', error);
        alert('Payment processing failed. Please try again.');
      }
    },
    []
  );

  return { purchasedExamIds, hasAllAccess, isLoggedIn, loading, catalog, hasAccess, priceFor, buyExam, refresh: load };
}
