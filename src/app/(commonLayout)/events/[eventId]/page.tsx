import {
  CalendarDays,
  Clock3,
  Link2,
  MapPin,
  Star,
  UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { getUserInfo } from '@/services/auth.services';
import EventParticipationActions from '@/components/modules/Event/EventParticipationActions';
import { extractArrayPayload, mapEvent, mapReview } from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';
import { Button } from '@/components/ui/button';

type EventDetailsPageProps = {
  params: Promise<{ eventId: string }>;
};

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
  const { eventId } = await params;
  const user = await getUserInfo();

  let event = mapEvent({});
  let reviews = [] as ReturnType<typeof mapReview>[];
  let isError = false;

  try {
    const [eventResponse, reviewsResponse] = await Promise.all([
      platformServerServices.getEventById(eventId),
      platformServerServices.getEventReviews(eventId),
    ]);

    event = mapEvent(eventResponse.data);
    reviews = extractArrayPayload(reviewsResponse.data).map(item =>
      mapReview(item),
    );
  } catch {
    isError = true;
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : '0.0';

  const isOwner = !!user?.id && !!event.ownerId && user.id === event.ownerId;

  if (isError || !event.id) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-14">
        <section className="w-full max-w-xl rounded-3xl border border-rose-200 bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            Event Details Unavailable
          </h1>
          <p className="mt-3 text-muted-foreground">
            We could not load this event right now. It may have been removed or
            you may not have access.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Link href="/events">Back to Events</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-14 sm:py-20">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <article className="rounded-3xl bg-card p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          {event.image ? (
            <div className="mb-6 overflow-hidden rounded-2xl border border-border">
              <Image
                src={event.image}
                alt={event.title}
                width={1200}
                height={640}
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-sky-100 text-sky-700">
              {event.visibility}
            </Badge>
            <Badge
              className={
                event.feeType.toUpperCase() === 'PAID'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }
            >
              {event.feeType}
            </Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{event.description}</p>

          <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-xl bg-muted p-3">
              <CalendarDays className="size-4" />
              Date: {event.eventDate || 'TBD'}
            </p>
            <p className="flex items-center gap-2 rounded-xl bg-muted p-3">
              <Clock3 className="size-4" />
              Time: {event.eventTime || 'TBD'}
            </p>
            <p className="flex items-center gap-2 rounded-xl bg-muted p-3">
              <MapPin className="size-4" />
              Venue: {event.venue}
            </p>
            <p className="flex items-center gap-2 rounded-xl bg-muted p-3">
              <UserRound className="size-4" />
              Organizer: {event.organizerName}
            </p>
            <p className="flex items-center gap-2 rounded-xl bg-muted p-3 sm:col-span-2">
              <Link2 className="size-4" />
              Event Link:{' '}
              {event.eventLink ? (
                <a
                  href={event.eventLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-sky-700 hover:text-sky-600"
                >
                  Open Event Link
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <p className="rounded-xl bg-muted p-3">
              Participants: {event.totalParticipants ?? 0}
            </p>
            <p className="rounded-xl bg-muted p-3">
              Reviews: {event.totalReviews ?? reviews.length}
            </p>
            <p className="rounded-xl bg-muted p-3">
              Invitations: {event.totalInvitations ?? 0}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border p-5">
            <h2 className="text-lg font-bold text-foreground">
              Reviews & Ratings
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Joined participants can submit reviews after the owner marks this
              event as completed.
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-amber-600">
              <Star className="size-4 fill-amber-500 text-amber-500" />
              Average Rating: {averageRating} / 5 ({reviews.length} reviews)
            </p>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {reviews.slice(0, 3).map(review => (
                <p
                  key={review.id}
                  className="line-clamp-3 rounded-lg bg-muted p-3"
                >
                  <span className="font-semibold">{review.userName}:</span>{' '}
                  {review.review}
                </p>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground dark:bg-card dark:text-card-foreground shadow-xl">
            <h2 className="text-xl font-bold">Registration Fee</h2>
            <p className="mt-2 text-3xl font-bold">
              {event.registrationFee === 0
                ? 'Free'
                : `৳${event.registrationFee}`}
            </p>
            <p className="mt-3 text-sm text-primary-foreground/80 dark:text-muted-foreground">
              Paid join attempts become pending until host approval.
            </p>
            <EventParticipationActions
              eventId={event.id}
              visibility={event.visibility}
              feeType={event.feeType}
              registrationFee={event.registrationFee}
              isOwner={isOwner}
              isAuthenticated={!!user}
              loginRedirectPath={`/events/${event.id}`}
            />
          </div>

          {isOwner && (
            <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-foreground">
                Owner Controls
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Approve or reject join requests</li>
                <li>Ban participants</li>
                <li>Edit event details</li>
                <li>Delete inappropriate/obsolete event</li>
              </ul>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default EventDetailsPage;
