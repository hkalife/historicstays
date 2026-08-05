import type { Review } from '@/lib/mappers';
import { apiClient } from './client';

export type CreateReviewInput = {
  authorName: string;
  rating: number;
  comment: string;
};

export function getReviews(stayId: string): Promise<{ reviews: Review[] }> {
  return apiClient.get(`/api/stays/${stayId}/reviews`);
}

export function createReview(
  stayId: string,
  input: CreateReviewInput
): Promise<{ review: Review }> {
  return apiClient.post(`/api/stays/${stayId}/reviews`, input);
}
