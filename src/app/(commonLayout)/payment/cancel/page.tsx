import Link from 'next/link';
import { CircleOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/services/auth.services';
import { platformServerServices } from '@/services/platform.server.services';

type PaymentCancelPageProps = {
  searchParams: Promise<{ trxId?: string }>;
};

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const getText = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

const PaymentCancelPage = async ({ searchParams }: PaymentCancelPageProps) => {
  const { trxId = '' } = await searchParams;
  const user = await getUserInfo();

  let eventId = '';

  if (trxId && user) {
    try {
      const response =
        await platformServerServices.validatePaymentTransaction(trxId);
      const transaction = asRecord(response.data);
      const event = asRecord(transaction.event);

      eventId = getText(event.id);
    } catch {
      // Keep page usable without blocking on validation lookup.
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-slate-100 via-white to-slate-200 px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-10">
        <CircleOff className="mx-auto size-14 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-muted-foreground">
          You cancelled the payment process. No charge was made and your event
          request was not submitted.
        </p>
        {trxId ? (
          <p className="mt-2 text-sm text-muted-foreground">Transaction: {trxId}</p>
        ) : null}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Link href={eventId ? `/events/${eventId}` : '/events'}>
              Return to Events
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-border bg-card text-muted-foreground hover:bg-muted"
          >
            <Link href="/dashboard/my-events">Go to My Events</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default PaymentCancelPage;
