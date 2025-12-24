import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function useDataLoader() {
  const loadData = useStore((state) => state.loadData);
  const isLoading = useStore((state) => state.isLoading);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { isLoading };
}