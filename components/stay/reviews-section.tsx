'use client';

import { useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';
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
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-border/40" />
          ))}
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
          <label htmlFor="review-name" className="text-xs font-medium text-foreground/60">
            {t.stayDetail.reviews.nameLabel}
          </label>
          <input
            id="review-name"
            type="text"
            required
            maxLength={80}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder={t.stayDetail.reviews.namePlaceholder}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
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
          <label htmlFor="review-comment" className="text-xs font-medium text-foreground/60">
            {t.stayDetail.reviews.commentLabel}
          </label>
          <textarea
            id="review-comment"
            required
            maxLength={1000}
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.stayDetail.reviews.commentPlaceholder}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
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
          className="mt-4 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createReview.isPending
            ? t.stayDetail.reviews.submitting
            : t.stayDetail.reviews.submitButton}
        </button>
      </form>
    </div>
  );
}
