import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/services/auth.services';
import { platformServerServices } from '@/services/platform.server.services';

type PaymentFailPageProps = {
  searchParams: Promise<{ trxId?: string }>;
};

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const getText = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

const PaymentFailPage = async ({ searchParams }: PaymentFailPageProps) => {
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
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-rose-50 via-white to-orange-50 px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-rose-100 bg-card p-8 text-center shadow-lg sm:p-10">
        <AlertTriangle className="mx-auto size-14 text-rose-600" />
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          Payment Failed
        </h1>
        <p className="mt-3 text-muted-foreground">
          We could not complete your payment. Please retry with a valid payment
          method or contact support if the issue persists.
        </p>
        {trxId ? (
          <p className="mt-2 text-sm text-muted-foreground">Transaction: {trxId}</p>
        ) : null}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-rose-600 text-white hover:bg-rose-500">
            <Link href={eventId ? `/events/${eventId}` : '/events'}>
              Retry Payment
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-border bg-card text-muted-foreground hover:bg-muted"
          >
            <Link href="/contact-us">Contact Support</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default PaymentFailPage;
