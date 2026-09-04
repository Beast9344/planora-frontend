'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  deleteMyReviewAction,
  updateMyReviewAction,
} from '@/app/(dashboardLayout)/dashboard/_actions';

type MyReviewCardProps = {
  reviewId: string;
  rating: number;
  reviewText: string;
  eventTitle?: string;
  createdAt?: string;
};

const MyReviewCard = ({
  reviewId,
  rating,
  reviewText,
  eventTitle,
  createdAt,
}: MyReviewCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [currentRating, setCurrentRating] = useState(String(rating || 1));
  const [currentReview, setCurrentReview] = useState(reviewText || '');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const parsedRating = Number(currentRating);
      const result = await updateMyReviewAction(reviewId, {
        rating: Number.isFinite(parsedRating) ? parsedRating : undefined,
        review: currentReview,
      });

      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        setIsEditing(false);
        router.refresh();
      }
    });
  };

  const onDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?',
    );

    if (!confirmed) {
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const result = await deleteMyReviewAction(reviewId);

      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <article className="rounded-xl border border-border bg-muted p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">
            {eventTitle || 'Event review'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Rating: {rating}/5</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setIsEditing(prev => !prev);
              setFeedback(null);
            }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Rating</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={currentRating}
              onChange={event => setCurrentRating(event.target.value)}
              disabled={isPending}
              className="h-10 max-w-24"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Review</label>
            <Textarea
              value={currentReview}
              onChange={event => setCurrentReview(event.target.value)}
              disabled={isPending}
              rows={4}
              placeholder="Share your experience"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          {reviewText || 'No review text provided.'}
        </p>
      )}

      {feedback ? (
        <p
          className={`mt-3 text-sm ${
            feedback.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </article>
  );
};

export default MyReviewCard;
