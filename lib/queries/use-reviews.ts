import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createReview, getReviews, type CreateReviewInput } from '@/lib/api/reviews';

export function useReviewsQuery(stayId: string) {
  return useQuery({
    queryKey: ['reviews', stayId],
    queryFn: () => getReviews(stayId),
    enabled: Boolean(stayId),
  });
}

export function useCreateReviewMutation(stayId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => createReview(stayId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', stayId] });
    },
  });
}
