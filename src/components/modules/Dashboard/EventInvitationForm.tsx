'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  inviteUserToEventAction,
  searchUsersForInvitationAction,
} from '@/app/(dashboardLayout)/dashboard/my-events/_actions';

type InviteCandidate = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type EventInvitationFormProps = {
  eventId: string;
};

const EventInvitationForm = ({ eventId }: EventInvitationFormProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [invitingCandidateId, setInvitingCandidateId] = useState<string | null>(
    null,
  );
  const [isManualInvitePending, setIsManualInvitePending] = useState(false);
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<InviteCandidate[]>([]);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadCandidates = useCallback(
    async (keyword = '') => {
      setIsSearching(true);

      try {
        const result = await searchUsersForInvitationAction(eventId, keyword);

        if (!result.success) {
          setCandidates([]);
          setFeedback({
            type: 'error',
            message: result.message,
          });
          return;
        }

        const users = result.data
          .filter(item => item.id)
          .map(item => ({
            id: item.id,
            name: item.name || 'Unnamed user',
            email: item.email || '',
            image: item.image,
          }));

        setCandidates(users as InviteCandidate[]);
      } catch {
        setCandidates([]);
      } finally {
        setIsSearching(false);
      }
    },
    [eventId],
  );

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const inviteUser = async (targetUserId: string) => {
    setFeedback(null);

    const result = await inviteUserToEventAction(eventId, targetUserId.trim());
    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });

    if (result.success) {
      setUserId('');
      await loadCandidates(searchTerm.trim());
    }
  };

  const inviteCandidate = async (targetUserId: string) => {
    setInvitingCandidateId(targetUserId);

    try {
      await inviteUser(targetUserId);
    } finally {
      setInvitingCandidateId(null);
    }
  };

  const inviteManual = async () => {
    setIsManualInvitePending(true);

    try {
      await inviteUser(userId);
    } finally {
      setIsManualInvitePending(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inviteManual();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border p-4">
        <p className="font-semibold text-foreground">Find User</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Search by name or email and invite directly.
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder="Search by name or email"
            disabled={isSearching || isManualInvitePending}
            className="h-11"
          />
          <Button
            type="button"
            variant="outline"
            disabled={isSearching || isManualInvitePending}
            onClick={async () => {
              setFeedback(null);
              await loadCandidates(searchTerm.trim());
            }}
            className="h-11"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {candidates.map(candidate => (
            <article
              key={candidate.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
            >
              <div>
                <p className="font-medium text-foreground">{candidate.name}</p>
                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                <p className="text-xs text-muted-foreground">ID: {candidate.id}</p>
              </div>
              <Button
                type="button"
                disabled={isSearching || isManualInvitePending}
                onClick={() => inviteCandidate(candidate.id)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {invitingCandidateId === candidate.id
                  ? 'Inviting...'
                  : 'Invite'}
              </Button>
            </article>
          ))}

          {!isSearching && candidates.length === 0 ? (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              No eligible users found for invitation.
            </p>
          ) : null}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-2xl border border-border p-4"
      >
        <p className="font-semibold text-foreground">Invite By User ID</p>
        <p className="text-sm text-muted-foreground">
          Manual fallback if you already have the user id.
        </p>

        <div className="space-y-2">
          <Label htmlFor="invite-user-id">User ID</Label>
          <Input
            id="invite-user-id"
            value={userId}
            onChange={event => setUserId(event.target.value)}
            placeholder="Paste target user id"
            disabled={isManualInvitePending || Boolean(invitingCandidateId)}
            className="h-11"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isManualInvitePending || Boolean(invitingCandidateId)}
          className="h-11 bg-primary text-white hover:bg-primary/90"
        >
          {isManualInvitePending ? 'Sending...' : 'Send Invitation'}
        </Button>
      </form>

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

export default EventInvitationForm;
