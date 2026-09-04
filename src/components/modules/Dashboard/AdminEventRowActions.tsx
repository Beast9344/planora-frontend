'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteEventByAdminAction } from '@/app/(dashboardLayout)/admin/dashboard/_actions';

type AdminEventRowActionsProps = {
  eventId: string;
};

const AdminEventRowActions = ({ eventId }: AdminEventRowActionsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const onDelete = () => {
    const confirmed = window.confirm('Delete this event?');

    if (!confirmed) {
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const result = await deleteEventByAdminAction(eventId);

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
    <div className="space-y-2">
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={onDelete}
      >
        {isPending ? 'Deleting...' : 'Delete Event'}
      </Button>
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

export default AdminEventRowActions;
