'use client';

import { FormEvent, useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePasswordAction } from '@/app/(dashboardLayout)/(commonProtectedLayout)/change-password/_action';

const ChangePasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const resetFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        resetFields();
      }
    });
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Change Password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a strong password with at least 6 characters.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="size-3.5" /> Secure Update
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="current-password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={event => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
              className="h-11 pl-10 pr-10"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
              aria-label="Toggle current password visibility"
            >
              {showCurrent ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              placeholder="Enter new password"
              className="h-11 pl-10 pr-10"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowNew(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
              aria-label="Toggle new password visibility"
            >
              {showNew ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="h-11 pl-10 pr-10"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {feedback ? (
          <p
            className={`rounded-lg p-3 text-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 bg-primary text-white hover:bg-primary/90"
          >
            {isPending ? 'Updating...' : 'Update Password'}
          </Button>
          <Button asChild variant="outline" className="h-11">
            <Link href="/my-profile">Back to Profile</Link>
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ChangePasswordForm;
