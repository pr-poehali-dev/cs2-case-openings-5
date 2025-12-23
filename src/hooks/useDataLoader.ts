import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function useDataLoader() {
  const loadData = useStore((state) => state.loadData);
  const isLoading = useStore((state) => state.isLoading);

  useEffect(() => {
    localStorage.removeItem('cs2-cases-storage');
    loadData();
  }, [loadData]);

  return { isLoading };
}