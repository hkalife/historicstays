'use client';

import { useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { TextAreaField, TextField } from '@/components/ui/text-field';
import { FIELD_LIMITS } from '@/lib/forms/constants';
import { useTranslations } from '@/lib/i18n/use-translations';
import { useCreateReviewMutation, useReviewsQuery } from '@/lib/queries/use-reviews';

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          className="cursor-pointer active:scale-90"
        >
          <Star
            className={`h-6 w-6 ${n <= value ? 'fill-accent text-accent' : 'text-border'}`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection({ stayId }: { stayId: string }) {
  const t = useTranslations();
  const { data, isLoading, isError } = useReviewsQuery(stayId);
  const createReview = useCreateReviewMutation(stayId);

  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createReview.mutate(
      { authorName, rating, comment },
      {
        onSuccess: () => {
          setAuthorName('');
          setRating(5);
          setComment('');
        },
      }
    );
  }

  const reviews = data?.reviews ?? [];

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-foreground">{t.stayDetail.reviews.title}</h2>
      {reviews.length > 0 && (
        <p className="mt-1 text-sm text-foreground/60">{t.stayDetail.reviews.basedOn(reviews.length)}</p>
      )}

      {isLoading && (
        <div className="mt-4 flex justify-center py-6">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="mt-4 text-sm text-accent">{t.stayDetail.loadError}</p>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <p className="mt-4 text-sm text-foreground/60">{t.stayDetail.reviews.noReviews}</p>
      )}

      {!isLoading && !isError && reviews.length > 0 && (
        <ul className="mt-4 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{review.authorName}</span>
                <span className="flex items-center gap-1 text-sm text-foreground/70">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
                  {review.rating}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{review.comment}</p>
              <p className="mt-2 text-xs text-foreground/50">{review.createdAt}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-border p-4">
        <h3 className="font-serif text-base font-semibold text-foreground">
          {t.stayDetail.reviews.writeReviewTitle}
        </h3>

        <div className="mt-3">
          <TextField
            id="review-name"
            type="text"
            required
            label={t.stayDetail.reviews.nameLabel}
            value={authorName}
            onChange={setAuthorName}
            maxLength={FIELD_LIMITS.reviewAuthorName}
            placeholder={t.stayDetail.reviews.namePlaceholder}
          />
        </div>

        <div className="mt-3">
          <span className="text-xs font-medium text-foreground/60">
            {t.stayDetail.reviews.ratingLabel}
          </span>
          <div className="mt-1">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="mt-3">
          <TextAreaField
            id="review-comment"
            required
            rows={3}
            label={t.stayDetail.reviews.commentLabel}
            value={comment}
            onChange={setComment}
            maxLength={FIELD_LIMITS.comment}
            placeholder={t.stayDetail.reviews.commentPlaceholder}
          />
        </div>

        {createReview.isError && (
          <p className="mt-3 text-sm text-accent">{t.stayDetail.reviews.submitError}</p>
        )}
        {createReview.isSuccess && (
          <p className="mt-3 text-sm text-primary">{t.stayDetail.reviews.submitSuccess}</p>
        )}

        <button
          type="submit"
          disabled={createReview.isPending}
          className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createReview.isPending && <Spinner />}
          {createReview.isPending
            ? t.stayDetail.reviews.submitting
            : t.stayDetail.reviews.submitButton}
        </button>
      </form>
    </div>
  );
}
