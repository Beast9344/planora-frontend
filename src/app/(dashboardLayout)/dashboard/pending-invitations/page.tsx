import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StaticPageShell from '@/components/modules/Dashboard/StaticPageShell';
import InvitationResponseButtons from '@/components/modules/Dashboard/InvitationResponseButtons';
import {
  extractArrayPayload,
  mapInvitation,
  mapParticipation,
} from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';

const PendingInvitationsPage = async () => {
  let invitations = [] as ReturnType<typeof mapInvitation>[];
  let participations = [] as ReturnType<typeof mapParticipation>[];

  try {
    const [invitationResponse, participationResponse] = await Promise.all([
      platformServerServices.getMyInvitations(),
      platformServerServices.getMyParticipations(),
    ]);

    invitations = extractArrayPayload(invitationResponse.data).map(item =>
      mapInvitation(item),
    );
    participations = extractArrayPayload(participationResponse.data).map(item =>
      mapParticipation(item),
    );
  } catch {
    invitations = [];
    participations = [];
  }

  const pendingInvites = invitations.filter(
    invitation => invitation.status.toUpperCase() === 'PENDING',
  );
  const pendingParticipations = participations.filter(participation =>
    participation.status.toUpperCase().includes('PENDING'),
  );

  return (
    <StaticPageShell
      eyebrow="Dashboard"
      title="Pending Invitations"
      description="Track invitations waiting for host approval after payment or private join requests."
      metrics={[
        { label: 'Pending Approval', value: String(pendingInvites.length) },
        {
          label: 'Pending Requests',
          value: String(pendingParticipations.length),
        },
        {
          label: 'Total Pending Signals',
          value: String(pendingInvites.length + pendingParticipations.length),
        },
      ]}
    >
      <div className="space-y-3">
        {pendingInvites.map(invitation => (
          <div
            key={invitation.id}
            className="rounded-xl border border-border bg-muted p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {invitation.eventTitle}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Status: {invitation.status}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sent:{' '}
                  {invitation.createdAt
                    ? new Date(invitation.createdAt).toLocaleString()
                    : 'N/A'}
                </p>
                {invitation.eventId ? (
                  <Button asChild size="sm" variant="outline" className="mt-2">
                    <Link href={`/events/${invitation.eventId}`}>
                      View Event
                    </Link>
                  </Button>
                ) : null}
              </div>

              <InvitationResponseButtons
                invitationId={invitation.id}
                status={invitation.status}
              />
            </div>
          </div>
        ))}

        {pendingParticipations.length > 0 ? (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="font-semibold text-orange-900">
              Participation Requests Waiting Host Approval
            </p>
            <div className="mt-3 space-y-2">
              {pendingParticipations.map(item => (
                <div
                  key={item.id}
                  className="rounded-lg border border-orange-200 bg-card p-3"
                >
                  <p className="font-medium text-foreground">
                    {item.eventTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Payment: {item.paymentStatus} | Status: {item.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {pendingInvites.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending invitations at this moment.
          </p>
        ) : null}
      </div>
    </StaticPageShell>
  );
};

export default PendingInvitationsPage;
