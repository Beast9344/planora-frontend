import StaticPageShell from '@/components/modules/Dashboard/StaticPageShell';

const EventDetailsPage = () => {
  return (
    <StaticPageShell
      eyebrow="Admin"
      title="Event Details"
      description="Inspect event metadata, organizer activity, payment footprint, and moderation notes."
      metrics={[
        { label: 'Participants', value: '187' },
        { label: 'Pending Reviews', value: '04' },
        { label: 'Risk Level', value: 'Moderate' },
      ]}
    />
  );
};

export default EventDetailsPage;
