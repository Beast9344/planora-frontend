import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MyReviewCard from '@/components/modules/Dashboard/MyReviewCard';
import CreateReviewCard from '@/components/modules/Dashboard/CreateReviewCard';
import StaticPageShell from '@/components/modules/Dashboard/StaticPageShell';
import {
  extractArrayPayload,
  mapParticipation,
  mapReview,
} from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';

const MyReviewsPage = async () => {
  let reviews = [] as ReturnType<typeof mapReview>[];
  let participations = [] as ReturnType<typeof mapParticipation>[];

  try {
    const [reviewsResponse, participationsResponse] = await Promise.all([
      platformServerServices.getMyReviews(),
      platformServerServices.getMyParticipations(),
    ]);

    reviews = extractArrayPayload(reviewsResponse.data).map(item =>
      mapReview(item),
    );
    participations = extractArrayPayload(participationsResponse.data).map(
      item => mapParticipation(item),
    );
  } catch {
    reviews = [];
    participations = [];
  }

  const reviewedEventIds = new Set(
    reviews
      .map(review => review.eventId)
      .filter((eventId): eventId is string => typeof eventId === 'string'),
  );

  const readyToReview = participations.filter(participation => {
    const participationStatus = participation.status.toUpperCase();
    const eventStatus = (participation.eventStatus || '').toUpperCase();

    if (!participation.eventId || reviewedEventIds.has(participation.eventId)) {
      return false;
    }

    return (
      eventStatus === 'COMPLETED' &&
      (participationStatus === 'JOINED' || participationStatus === 'APPROVED')
    );
  });

  return (
    <StaticPageShell
      eyebrow="Dashboard"
      title="My Reviews"
      description="Give reviews only for completed events where your participation is confirmed, then edit/manage your published reviews."
      metrics={[
        { label: 'Published Reviews', value: String(reviews.length) },
        { label: 'Ready To Review', value: String(readyToReview.length) },
        {
          label: 'Average Rating',
          value:
            reviews.length > 0
              ? (
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : '0.0',
        },
      ]}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap justify-end">
          <Button asChild variant="outline">
            <Link href="/events">Browse Events to Review</Link>
          </Button>
        </div>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-lg font-bold text-foreground">Ready to Review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You can submit a review after the owner marks the event completed.
          </p>

          <div className="mt-3 space-y-3">
            {readyToReview.map(item => (
              <CreateReviewCard
                key={item.id}
                eventId={item.eventId}
                eventTitle={item.eventTitle}
              />
            ))}

            {readyToReview.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No completed participated events are waiting for your review.
              </p>
            ) : null}
          </div>
        </section>

        {reviews.map(review => (
          <MyReviewCard
            key={review.id}
            reviewId={review.id}
            rating={review.rating}
            reviewText={review.review}
            eventTitle={review.eventTitle}
            createdAt={review.createdAt}
          />
        ))}
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews found yet.</p>
        ) : null}
      </div>
    </StaticPageShell>
  );
};

export default MyReviewsPage;
