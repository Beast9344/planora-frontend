import HomeCategoriesSection from '@/components/modules/Home/HomeCategoriesSection';
import HomeBlogsSection from '@/components/modules/Home/HomeBlogsSection';
import HomeCtaSection from '@/components/modules/Home/HomeCtaSection';
import HomeEventStatsSection from '@/components/modules/Home/HomeEventStatsSection';
import HomeFaqSection from '@/components/modules/Home/HomeFaqSection';
import HomeFeaturesSection from '@/components/modules/Home/HomeFeaturesSection';
import HomeHeroSection from '@/components/modules/Home/HomeHeroSection';
import HomeHighlightsSection from '@/components/modules/Home/HomeHighlightsSection';
import HomeHowItWorksSection from '@/components/modules/Home/HomeHowItWorksSection';
import HomeTestimonialsSection from '@/components/modules/Home/HomeTestimonialsSection';
import HomeUpcomingEventsSection from '@/components/modules/Home/HomeUpcomingEventsSection';
import { HomeEvent } from '@/components/modules/Home/home-data';
import { extractArrayPayload, mapEvent } from '@/lib/apiMappers';
import { platformServerServices } from '@/services/platform.server.services';

const toHomeEvent = (input: ReturnType<typeof mapEvent>): HomeEvent => {
  return {
    id: input.id || `event-${Date.now()}`,
    title: input.title,
    image: input.image,
    description: input.description,
    date: input.eventDate,
    time: input.eventTime,
    venue: input.venue,
    organizer: input.organizerName,
    visibility:
      input.visibility.toUpperCase() === 'PRIVATE' ? 'Private' : 'Public',
    feeType: input.feeType.toUpperCase() === 'PAID' ? 'Paid' : 'Free',
    fee: input.registrationFee,
    participantCount: input.totalParticipants,
  };
};

export default async function HomePage() {
  let dynamicEvents: HomeEvent[] = [];

  try {
    const response = await platformServerServices.getUpcomingEvents();
    dynamicEvents = extractArrayPayload(response.data).map(item =>
      toHomeEvent(mapEvent(item)),
    );
  } catch {
    dynamicEvents = [];
  }

  const featured = dynamicEvents[0];
  const upcoming = dynamicEvents.slice(1, 10);

  return (
    <main className="min-h-screen bg-background">
      {/* 1 */}
      <HomeHeroSection event={featured} />
      {/* 2 */}
      <HomeEventStatsSection events={dynamicEvents} />
      {/* 3 */}
      <HomeHighlightsSection />
      {/* 4 */}
      <HomeUpcomingEventsSection events={upcoming} />
      {/* 5 */}
      <HomeHowItWorksSection />
      {/* 6 */}
      <HomeFeaturesSection />
      {/* 7 */}
      <HomeCategoriesSection />
      {/* 8 */}
      <HomeTestimonialsSection />
      {/* 9 */}
      <HomeBlogsSection />
      {/* 10 */}
      <HomeFaqSection />
      {/* 11 */}
      {/* <HomeNewsletterSection /> */}
      {/* 12 */}
      <HomeCtaSection />
    </main>
  );
}
