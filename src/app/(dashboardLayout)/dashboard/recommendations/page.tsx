import Link from 'next/link';
import { Brain, CalendarDays, Sparkles, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mapEvent } from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
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

type RecommendationViewModel = ReturnType<typeof mapEvent> & {
  aiReason: string;
  aiScore: number;
};

const RecommendationsPage = async () => {
  let recommendations: RecommendationViewModel[] = [];
  let preferredVisibility = 'PUBLIC';
  let preferredFeeType = 'FREE';
  let signalCounts = {
    participations: 0,
    invitations: 0,
    reviews: 0,
  };

  try {
    const response =
      await platformServerServices.getPersonalizedEventRecommendations({
        limit: 9,
      });

    const payload = asRecord(response.data);
    const insights = asRecord(payload.insights);
    const signalStrength = asRecord(insights.signalStrength);
    const items = Array.isArray(payload.recommendations)
      ? payload.recommendations
      : [];

    preferredVisibility = pickString(
      insights.preferredVisibility,
      preferredVisibility,
    );
    preferredFeeType = pickString(insights.preferredFeeType, preferredFeeType);
    signalCounts = {
      participations: pickNumber(signalStrength.participations),
      invitations: pickNumber(signalStrength.invitations),
      reviews: pickNumber(signalStrength.reviews),
    };

    recommendations = items.map(item => {
      const eventPayload = asRecord(item);

      return {
        ...mapEvent(eventPayload),
        aiReason: pickString(
          eventPayload.aiReason,
          'Recommended based on your activity signals.',
        ),
        aiScore: pickNumber(eventPayload.aiScore),
      };
    });
  } catch {
    recommendations = [];
  }

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
          AI Recommendations
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Personalized Event Discovery
        </h1>
        <p className="mt-3 max-w-3xl text-primary-foreground/80 dark:text-muted-foreground">
          These events are ranked using your invitation, participation, and
          review patterns.
        </p>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="size-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">AI Insight</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary text-white">
            Preferred Visibility: {preferredVisibility}
          </Badge>
          <Badge className="bg-emerald-600 text-white">
            Preferred Fee Type: {preferredFeeType}
          </Badge>
          <Badge variant="outline">
            Signals P/I/R: {signalCounts.participations}/
            {signalCounts.invitations}/{signalCounts.reviews}
          </Badge>
        </div>
      </section>

      {recommendations.length === 0 ? (
        <section className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No recommendations available yet. Join or review a few events and come
          back for stronger suggestions.
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map(event => (
            <article
              key={event.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-primary text-white">
                  {event.visibility} {event.feeType}
                </Badge>
                <p className="text-sm font-semibold text-primary">
                  AI Score: {event.aiScore}
                </p>
              </div>

              <h2 className="mt-4 line-clamp-2 min-h-14 text-xl font-bold text-foreground">
                {event.title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {event.aiReason}
              </p>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  {event.eventDate}
                </p>
                <p className="flex items-center gap-2">
                  <UserRound className="size-4" />
                  {event.organizerName}
                </p>
                <p className="flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Participants: {event.totalParticipants} | Reviews:{' '}
                  {event.totalReviews}
                </p>
              </div>

              <div className="mt-5">
                <Button
                  asChild
                  className="w-full bg-primary text-white hover:bg-primary/90"
                >
                  <Link href={`/events/${event.id}`}>View Event</Link>
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default RecommendationsPage;
