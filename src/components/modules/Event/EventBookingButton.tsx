'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  initiateEventPaymentAction,
  joinEventAction,
} from '@/app/(commonLayout)/events/_actions';

type EventBookingButtonProps = {
  eventId: string;
  feeType: string;
  isAuthenticated: boolean;
  isOwner: boolean;
  loginRedirectPath?: string;
};

const EventBookingButton = ({
  eventId,
  feeType,
  isAuthenticated,
  isOwner,
  loginRedirectPath,
}: EventBookingButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string>('');

  const isPaidEvent = feeType.toUpperCase() === 'PAID';

  const handleBook = () => {
    setFeedback('');

    if (isOwner) {
      return;
    }

    if (!isAuthenticated) {
      const redirectPath = loginRedirectPath || `/events/${eventId}`;
      window.location.assign(
        `/login?redirect=${encodeURIComponent(redirectPath)}`,
      );
      return;
    }

    startTransition(async () => {
      if (isPaidEvent) {
        const result = await initiateEventPaymentAction(eventId);
        const paymentUrl =
          result.success && result.data?.paymentUrl
            ? result.data.paymentUrl
            : '';

        if (!result.success || !paymentUrl) {
          setFeedback(result.message || 'Could not start payment. Try again.');
          return;
        }

        window.location.assign(paymentUrl);
        return;
      }

      const result = await joinEventAction(eventId);
      if (!result.success) {
        setFeedback(result.message);
        return;
      }

      setFeedback('Join request sent. Check pending invitations.');
    });
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleBook}
        disabled={isPending || isOwner}
        className="w-full bg-orange-500 text-white hover:bg-orange-400"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Processing...
          </span>
        ) : isOwner ? (
          'You are the owner'
        ) : isAuthenticated ? (
          isPaidEvent ? (
            'Pay & Book'
          ) : (
            'Book Event'
          )
        ) : isPaidEvent ? (
          'Login to Pay & Book'
        ) : (
          'Login to Book'
        )}
      </Button>

      {feedback ? (
        <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          {feedback}
        </p>
      ) : null}
    </div>
  );
};

export default EventBookingButton;
