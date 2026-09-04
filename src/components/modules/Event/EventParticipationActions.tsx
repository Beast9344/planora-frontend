'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  initiateEventPaymentAction,
  joinEventAction,
} from '@/app/(commonLayout)/events/_actions';

type EventParticipationActionsProps = {
  eventId: string;
  visibility: string;
  feeType: string;
  registrationFee: number;
  isOwner: boolean;
  isAuthenticated?: boolean;
  loginRedirectPath?: string;
};

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const EventParticipationActions = ({
  eventId,
  visibility,
  feeType,
  registrationFee,
  isOwner,
  isAuthenticated = false,
  loginRedirectPath,
}: EventParticipationActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const normalizedVisibility = visibility.toUpperCase();
  const normalizedFeeType = feeType.toUpperCase();

  const actionLabel =
    normalizedFeeType === 'PAID' ? 'Pay & Request' : 'Request to Join';

  const rules = [
    normalizedVisibility === 'PRIVATE'
      ? 'This is a private event. Your request must be approved by the host.'
      : 'This is a public event. Your request will still need host approval.',
    normalizedFeeType === 'PAID'
      ? `This event requires a payment of BDT ${registrationFee} before approval.`
      : 'This event is free. No payment is required.',
    'Event owner and admins can approve, reject, or ban participants.',
    'Only joined participants can fully participate in the event.',
  ];

  const handleJoin = () => {
    setFeedback(null);

    if (!isAuthenticated) {
      const redirectPath = loginRedirectPath || `/events/${eventId}`;
      window.location.assign(
        `/login?redirect=${encodeURIComponent(redirectPath)}`,
      );
      return;
    }

    startTransition(async () => {
      try {
        if (normalizedFeeType === 'PAID') {
          const result = await initiateEventPaymentAction(eventId);
          const paymentUrl =
            result.success && result.data?.paymentUrl
              ? result.data.paymentUrl
              : '';

          if (!result.success || !paymentUrl) {
            setFeedback({
              type: 'error',
              message:
                result.message ||
                'Unable to start payment session right now. Please try again.',
            });
            return;
          }

          window.location.assign(paymentUrl);
          return;
        }

        const result = await joinEventAction(eventId);
        if (!result.success) {
          setFeedback({ type: 'error', message: result.message });
          return;
        }
        setFeedback({
          type: 'success',
          message: 'Join request sent. Please wait for host approval.',
        });
      } catch (error) {
        const errorRecord = asRecord(error);
        const responseRecord = asRecord(errorRecord.response);
        const dataRecord = asRecord(responseRecord.data);
        const message =
          typeof dataRecord.message === 'string'
            ? dataRecord.message
            : 'Request failed. Please try again.';

        setFeedback({
          type: 'error',
          message,
        });
      }
    });
  };

  if (isOwner) {
    return (
      <div className="mt-6 grid gap-2">
        <Button disabled className="bg-muted-foreground text-white">
          You are the event owner
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-border bg-transparent text-primary-foreground hover:bg-primary/80 dark:text-foreground dark:hover:bg-muted"
            >
              View Participation Rules
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Participation Rules</DialogTitle>
              <DialogDescription>
                Rules participants must follow for this event.
              </DialogDescription>
            </DialogHeader>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {rules.map(rule => (
                <li key={rule} className="rounded-lg bg-muted p-3">
                  {rule}
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-2">
      <Button
        onClick={handleJoin}
        disabled={isPending}
        className="bg-orange-500 text-white hover:bg-orange-400"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Processing...
          </span>
        ) : isAuthenticated ? (
          actionLabel
        ) : normalizedFeeType === 'PAID' ? (
          'Login to Pay & Join'
        ) : (
          'Login to Join'
        )}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-border bg-transparent text-primary-foreground hover:bg-primary/80 dark:text-foreground dark:hover:bg-muted"
          >
            View Participation Rules
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Participation Rules</DialogTitle>
            <DialogDescription>
              Check requirements before joining this event.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {rules.map(rule => (
              <li key={rule} className="rounded-lg bg-muted p-3">
                {rule}
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      {feedback ? (
        <p
          className={`rounded-lg p-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
};

export default EventParticipationActions;
