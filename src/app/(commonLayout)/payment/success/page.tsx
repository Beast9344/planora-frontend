import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserInfo } from '@/services/auth.services';
import { platformServerServices } from '@/services/platform.server.services';

type PaymentSuccessPageProps = {
  searchParams: Promise<{ trxId?: string }>;
};

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const getText = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

const getNumber = (value: unknown, fallback = 0) => {
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

const PaymentSuccessPage = async ({
  searchParams,
}: PaymentSuccessPageProps) => {
  const { trxId = '' } = await searchParams;
  const user = await getUserInfo();

  let eventId = '';
  let eventTitle = '';
  let paidAmount = 0;
  let validationError = '';

  if (trxId && user) {
    try {
      const response =
        await platformServerServices.validatePaymentTransaction(trxId);
      const transaction = asRecord(response.data);
      const event = asRecord(transaction.event);

      eventId = getText(event.id);
      eventTitle = getText(event.title);
      paidAmount = getNumber(transaction.amount, 0);
    } catch {
      validationError = 'Transaction verification could not be completed.';
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-emerald-100 bg-card p-8 text-center shadow-lg sm:p-10">
        <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          Payment Successful
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your payment has been processed successfully. Your participation
          request is now pending host approval.
        </p>
        {trxId ? (
          <p className="mt-2 text-sm text-muted-foreground">Transaction: {trxId}</p>
        ) : null}
        {eventTitle ? (
          <p className="mt-2 text-sm text-muted-foreground">Event: {eventTitle}</p>
        ) : null}
        {paidAmount > 0 ? (
          <p className="mt-1 text-sm font-semibold text-emerald-700">
            Paid Amount: BDT {paidAmount}
          </p>
        ) : null}
        {validationError ? (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            {validationError}
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Link href="/dashboard/pending-invitations">
              View Request Status
            </Link>
          </Button>
          {eventId ? (
            <Button
              asChild
              variant="outline"
              className="border-sky-300 bg-card text-sky-700 hover:bg-sky-50"
            >
              <Link href={`/events/${eventId}`}>View Event Details</Link>
            </Button>
          ) : null}
          <Button
            asChild
            variant="outline"
            className="border-border bg-card text-muted-foreground hover:bg-muted"
          >
            <Link href="/dashboard/my-payments">My Payments</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccessPage;
