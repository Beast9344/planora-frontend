'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { respondInvitationAction } from '@/app/(dashboardLayout)/dashboard/_actions';

type InvitationResponseButtonsProps = {
  invitationId: string;
  status: string;
};

const InvitationResponseButtons = ({
  invitationId,
  status,
}: InvitationResponseButtonsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const normalizedStatus = status.toUpperCase();
  const canRespond = normalizedStatus === 'PENDING';

  const applyAction = (action: 'accept' | 'reject') => {
    setFeedback(null);

    startTransition(async () => {
      const result = await respondInvitationAction(invitationId, action);

      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        router.refresh();
      }
    });
  };

  if (!canRespond) {
    return (
      <p className="text-xs font-semibold text-muted-foreground">{normalizedStatus}</p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          className="bg-emerald-600 text-white hover:bg-emerald-500"
          onClick={() => applyAction('accept')}
        >
          {isPending ? 'Processing...' : 'Accept'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => applyAction('reject')}
        >
          Reject
        </Button>
      </div>
      {feedback ? (
        <p
          className={`text-xs ${
            feedback.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
};

export default InvitationResponseButtons;
