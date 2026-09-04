const policySections = [
  {
    title: 'Data We Collect',
    text: 'Account details, event activity, and payment-related references to keep event workflows secure and traceable.',
  },
  {
    title: 'How We Use Data',
    text: 'To process registrations, manage invitations, support moderation, and improve your event discovery experience.',
  },
  {
    title: 'Data Sharing',
    text: 'We do not sell personal data. Limited sharing happens only with trusted infrastructure and payment providers.',
  },
  {
    title: 'Your Rights',
    text: 'You can request profile updates, account deletion, or data export by contacting the Planora support team.',
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-background py-14 sm:py-20">
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-card p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            Privacy Policy
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Your privacy matters at every event touchpoint.
          </h1>
          <p className="mt-4 text-muted-foreground">
            This policy explains how Planora collects, protects, and manages
            your personal data while you create, join, and manage events.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {policySections.map(section => (
              <article
                key={section.title}
                className="rounded-2xl border border-border bg-muted p-5"
              >
                <h2 className="text-lg font-bold text-foreground">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {section.text}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Last updated: March 2026
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
