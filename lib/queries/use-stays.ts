import { useQuery } from '@tanstack/react-query';
import { getStay, getStays, type StaySearchFilters } from '@/lib/api/stays';

export function useStaysQuery(filters: StaySearchFilters) {
  return useQuery({
    queryKey: ['stays', filters],
    queryFn: () => getStays(filters),
  });
}

export function useStayQuery(id: string) {
  return useQuery({
    queryKey: ['stays', id],
    queryFn: () => getStay(id),
    enabled: Boolean(id),
  });
}
