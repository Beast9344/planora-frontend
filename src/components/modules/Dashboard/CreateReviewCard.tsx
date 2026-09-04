'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createMyReviewAction } from '@/app/(dashboardLayout)/dashboard/_actions';

type CreateReviewCardProps = {
  eventId: string;
  eventTitle: string;
};

const CreateReviewCard = ({ eventId, eventTitle }: CreateReviewCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const parsedRating = Number(rating);
      const result = await createMyReviewAction(eventId, {
        rating: Number.isFinite(parsedRating) ? parsedRating : 0,
        review,
      });

      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        setReview('');
        setRating('5');
        router.refresh();
      }
    });
  };

  return (
    <article className="rounded-xl border border-border bg-muted p-4">
      <p className="font-semibold text-foreground">{eventTitle}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        You can review this event because it is completed and your participation
        is confirmed.
      </p>

      <form onSubmit={onSubmit} className="mt-3 space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Rating</label>
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={event => setRating(event.target.value)}
            disabled={isPending}
            className="h-10 max-w-24"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Review</label>
          <Textarea
            value={review}
            onChange={event => setReview(event.target.value)}
            disabled={isPending}
            rows={3}
            placeholder="Share your event experience"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>

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

export default CreateReviewCard;
