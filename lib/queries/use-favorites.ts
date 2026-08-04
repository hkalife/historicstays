import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavorite, getFavorites, removeFavorite } from '@/lib/api/favorites';

export function useFavoritesQuery(userId: string) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId),
    enabled: Boolean(userId),
  });
}

export function useAddFavoriteMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stayId: string) => addFavorite(userId, stayId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites', userId] }),
  });
}

export function useRemoveFavoriteMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stayId: string) => removeFavorite(userId, stayId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites', userId] }),
  });
}
