import Link from 'next/link';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChangePasswordForm from '@/components/modules/Dashboard/ChangePasswordForm';

const ChangePasswordPage = () => {
  return (
    <main className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
        <div className="pointer-events-none absolute -right-14 -top-20 size-56 rounded-full bg-orange-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-56 rounded-full bg-sky-500/15 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
              Security Settings
            </p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-bold sm:text-4xl">
              <KeyRound className="size-7" /> Change Password
            </h1>
            <p className="mt-3 max-w-3xl text-primary-foreground/80 dark:text-muted-foreground">
              Update your account password to keep your profile and dashboard
              secure.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-border bg-transparent text-primary-foreground hover:bg-primary/80 dark:text-foreground dark:hover:bg-muted"
          >
            <Link href="/my-profile">
              <ArrowLeft className="size-4" /> Back to Profile
            </Link>
          </Button>
        </div>
      </section>

      <ChangePasswordForm />
    </main>
  );
};

export default ChangePasswordPage;
