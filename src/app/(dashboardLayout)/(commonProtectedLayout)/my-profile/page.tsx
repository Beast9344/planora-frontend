import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileEditorCard from '@/components/modules/Dashboard/ProfileEditorCard';
import { getUserInfo } from '@/services/auth.services';
import { platformServerServices } from '@/services/platform.server.services';

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const extractArrayPayload = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;

  const record = asRecord(data);

  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.result)) return record.result;
  if (Array.isArray(record.items)) return record.items;

  return [];
};

const pickString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const pickNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const formatDate = (value: unknown): string => {
  const date = new Date(pickString(value));
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.trim()[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const MyProfilePage = async () => {
  const user = await getUserInfo();

  let profile = {
    id: user?.id || '',
    name: user?.name || 'Unknown User',
    email: user?.email || 'N/A',
    image: '',
    role: user?.role || 'USER',
    status: 'ACTIVE',
    emailVerified: false,
    createdAt: '',
    events: [] as unknown[],
    eventParticipants: [] as unknown[],
    eventReviews: [] as unknown[],
  };

  try {
    const response = await platformServerServices.getMyProfile();
    const payload = asRecord(response.data);

    profile = {
      id: pickString(payload.id, profile.id),
      name: pickString(payload.name, profile.name),
      email: pickString(payload.email, profile.email),
      image: pickString(payload.image),
      role: pickString(payload.role, profile.role),
      status: pickString(payload.status, 'ACTIVE'),
      emailVerified: Boolean(payload.emailVerified),
      createdAt: pickString(payload.createdAt),
      events: extractArrayPayload(payload.events),
      eventParticipants: extractArrayPayload(payload.eventParticipants),
      eventReviews: extractArrayPayload(payload.eventReviews),
    };
  } catch {
    // Keep fallback profile data so page still renders.
  }

  const hostedEventsCount = profile.events.length;
  const joinedEventsCount = profile.eventParticipants.length;
  const reviewsCount = profile.eventReviews.length;
  const participationPaidCount = profile.eventParticipants.filter(item => {
    const participant = asRecord(item);
    return pickString(participant.paymentStatus).toUpperCase() === 'PAID';
  }).length;
  const initials = getInitials(profile.name);

  return (
    <main className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 size-52 rounded-full bg-orange-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-60 rounded-full bg-sky-500/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
              Account Overview
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">My Profile</h1>
            <p className="mt-3 max-w-3xl text-primary-foreground/80 dark:text-muted-foreground">
              Review your account details and recent activity across hosted and
              joined events.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-card/10 p-4 backdrop-blur-sm">
            <Avatar className="size-14 ring-2 ring-white/40">
              {profile.image ? (
                <AvatarImage src={profile.image} alt={profile.name} />
              ) : null}
              <AvatarFallback className="bg-primary/80 text-primary-foreground">
                {initials || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-primary-foreground/80 dark:text-muted-foreground">Signed in as</p>
              <p className="text-lg font-bold">{profile.name}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">
              {profile.name}
            </h2>
            <Badge className="bg-primary text-white">{profile.role}</Badge>
            <Badge
              className={
                profile.emailVerified
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }
            >
              {profile.emailVerified ? 'Verified' : 'Not Verified'}
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="rounded-lg bg-muted p-3">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p className="rounded-lg bg-muted p-3">
              <span className="font-semibold">Status:</span> {profile.status}
            </p>
            <p className="rounded-lg bg-muted p-3">
              <span className="font-semibold">User ID:</span> {profile.id}
            </p>
            <p className="rounded-lg bg-muted p-3">
              <span className="font-semibold">Joined:</span>{' '}
              {formatDate(profile.createdAt)}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Link href="/change-password">Change Password</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/my-events">My Events</Link>
            </Button>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground">Activity Stats</h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p className="rounded-lg bg-muted p-3 text-muted-foreground">
              Hosted Events:{' '}
              <span className="font-semibold">{hostedEventsCount}</span>
            </p>
            <p className="rounded-lg bg-muted p-3 text-muted-foreground">
              Joined Events:{' '}
              <span className="font-semibold">{joinedEventsCount}</span>
            </p>
            <p className="rounded-lg bg-muted p-3 text-muted-foreground">
              Reviews Written:{' '}
              <span className="font-semibold">{reviewsCount}</span>
            </p>
            <p className="rounded-lg bg-muted p-3 text-muted-foreground">
              Paid Participations:{' '}
              <span className="font-semibold">{participationPaidCount}</span>
            </p>
          </div>
        </article>
      </section>

      <ProfileEditorCard
        name={profile.name}
        email={profile.email}
        image={profile.image}
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground">
          Recent Hosted Events
        </h3>
        <div className="mt-4 space-y-2">
          {profile.events.slice(0, 5).map((item, index) => {
            const event = asRecord(item);
            return (
              <p
                key={pickString(event.id, `event-${index}`)}
                className="rounded-lg bg-muted p-3 text-sm text-muted-foreground"
              >
                {pickString(event.title, 'Untitled event')} {' - '}{' '}
                {pickString(event.visibility, 'PUBLIC')}
              </p>
            );
          })}
          {profile.events.length === 0 ? (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              No hosted events yet.
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground">Recent Reviews</h3>
        <div className="mt-4 space-y-2">
          {profile.eventReviews.slice(0, 5).map((item, index) => {
            const review = asRecord(item);
            const relatedEvent = asRecord(review.event);

            return (
              <p
                key={pickString(review.id, `review-${index}`)}
                className="rounded-lg bg-muted p-3 text-sm text-muted-foreground"
              >
                {pickString(relatedEvent.title, 'Untitled event')} {' - '}{' '}
                Rating: {pickNumber(review.rating)}
              </p>
            );
          })}
          {profile.eventReviews.length === 0 ? (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default MyProfilePage;
