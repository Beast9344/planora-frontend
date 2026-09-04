'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  deleteMyEventAction,
  updateMyEventStatusAction,
  updateParticipantStateAction,
} from '@/app/(dashboardLayout)/dashboard/my-events/_actions';

type DeleteMyEventButtonProps = {
  eventId: string;
};

export const DeleteMyEventButton = ({ eventId }: DeleteMyEventButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          'Are you sure you want to delete this event?',
        );

        if (!confirmed) {
          return;
        }

        startTransition(async () => {
          const result = await deleteMyEventAction(eventId);
          if (result.success) {
            router.refresh();
          }
        });
      }}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
};

type UpdateMyEventStatusButtonsProps = {
  eventId: string;
  currentStatus?: string;
};

const statusClassMap: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-rose-50 text-rose-700',
};

export const UpdateMyEventStatusButtons = ({
  eventId,
  currentStatus,
}: UpdateMyEventStatusButtonsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const normalizedStatus = (currentStatus || 'ACTIVE').toUpperCase();

  const updateStatus = (nextStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    if (normalizedStatus === nextStatus) {
      return;
    }

    startTransition(async () => {
      const result = await updateMyEventStatusAction(eventId, nextStatus);
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p
        className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClassMap[normalizedStatus] || 'bg-muted text-muted-foreground'}`}
      >
        {normalizedStatus}
      </p>
      <Button
        size="sm"
        disabled={isPending || normalizedStatus === 'ACTIVE'}
        variant="outline"
        onClick={() => updateStatus('ACTIVE')}
      >
        Mark Active
      </Button>
      <Button
        size="sm"
        disabled={isPending || normalizedStatus === 'COMPLETED'}
        className="bg-emerald-600 text-white hover:bg-emerald-500"
        onClick={() => updateStatus('COMPLETED')}
      >
        Mark Complete
      </Button>
      <Button
        size="sm"
        disabled={isPending || normalizedStatus === 'CANCELLED'}
        variant="destructive"
        onClick={() => updateStatus('CANCELLED')}
      >
        Cancel Event
      </Button>
    </div>
  );
};

type ParticipantActionButtonsProps = {
  participantId: string;
  status?: string;
};

export const ParticipantActionButtons = ({
  participantId,
  status,
}: ParticipantActionButtonsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const normalizedStatus = (status || 'PENDING').toUpperCase();

  const applyAction = (action: 'accept' | 'approve' | 'reject' | 'ban') => {
    startTransition(async () => {
      const result = await updateParticipantStateAction(participantId, action);
      if (result.success) {
        router.refresh();
      }
    });
  };

  if (normalizedStatus === 'BANNED') {
    return (
      <p className="rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
        Banned
      </p>
    );
  }

  if (normalizedStatus === 'REJECTED') {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={isPending}
          className="bg-emerald-600 text-white hover:bg-emerald-500"
          onClick={() => applyAction('accept')}
        >
          Accept
        </Button>
        <Button
          size="sm"
          disabled={isPending}
          variant="destructive"
          onClick={() => applyAction('ban')}
        >
          Ban
        </Button>
      </div>
    );
  }

  if (normalizedStatus === 'APPROVED' || normalizedStatus === 'JOINED') {
    return (
      <div className="flex flex-wrap gap-2">
        <p className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
          {normalizedStatus}
        </p>
        <Button
          size="sm"
          disabled={isPending}
          variant="destructive"
          onClick={() => applyAction('ban')}
        >
          Ban
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        disabled={isPending}
        className="bg-emerald-600 text-white hover:bg-emerald-500"
        onClick={() => applyAction('accept')}
      >
        Accept
      </Button>
      <Button
        size="sm"
        disabled={isPending}
        variant="outline"
        onClick={() => applyAction('reject')}
      >
        Reject
      </Button>
      <Button
        size="sm"
        disabled={isPending}
        variant="destructive"
        onClick={() => applyAction('ban')}
      >
        Ban
      </Button>
    </div>
  );
};
