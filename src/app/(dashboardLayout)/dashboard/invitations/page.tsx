import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StaticPageShell from '@/components/modules/Dashboard/StaticPageShell';
import InvitationResponseButtons from '@/components/modules/Dashboard/InvitationResponseButtons';
import { extractArrayPayload, mapInvitation } from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';

const InvitationsPage = async () => {
  let invitations = [] as ReturnType<typeof mapInvitation>[];

  try {
    const response = await platformServerServices.getMyInvitations();
    invitations = extractArrayPayload(response.data).map(item =>
      mapInvitation(item),
    );
  } catch {
    invitations = [];
  }

  const pending = invitations.filter(
    invitation => invitation.status.toUpperCase() === 'PENDING',
  ).length;
  const accepted = invitations.filter(
    invitation => invitation.status.toUpperCase() === 'ACCEPTED',
  ).length;

  return (
    <StaticPageShell
      eyebrow="Dashboard"
      title="Invitations"
      description="Review event invitations, including paid and private invites, and respond quickly."
      metrics={[
        { label: 'Total Invites', value: String(invitations.length) },
        { label: 'Awaiting Response', value: String(pending) },
        { label: 'Accepted', value: String(accepted) },
      ]}
    >
      <div className="space-y-3">
        {invitations.map(invitation => (
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
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invitations found.</p>
        ) : null}
      </div>
    </StaticPageShell>
  );
};

export default InvitationsPage;
