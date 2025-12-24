import { useStore } from '@/lib/store';

export function useDataLoader() {
  const isLoading = useStore((state) => state.isLoading);
  
  // Отключено для экономии вызовов API - используем только локальные данные

  return { isLoading };
}