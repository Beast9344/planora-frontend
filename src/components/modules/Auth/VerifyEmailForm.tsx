'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  resendVerificationOtpAction,
  verifyEmailAction,
} from '@/app/(commonLayout)/(auth)/verify-email/_action';
import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IVerifyEmailPayload,
  verifyEmailZodSchema,
} from '@/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface VerifyEmailFormProps {
  initialEmail?: string;
}

const VerifyEmailForm = ({ initialEmail }: VerifyEmailFormProps) => {
  const [resendCooldown, setResendCooldown] = useState(0);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload),
  });

  const { mutateAsync: resendOtpMutateAsync, isPending: isResendingOtp } =
    useMutation({
      mutationFn: (email: string) =>
        resendVerificationOtpAction({
          email,
        }),
    });

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const form = useForm({
    defaultValues: {
      email: initialEmail || '',
      otp: '',
    },

    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync(value)) as any;

        if (result && !result.success) {
          toast.error(result.message || 'Email verification failed');
          return;
        }
      } catch (error: any) {
        if (
          error &&
          typeof error === 'object' &&
          'digest' in error &&
          typeof error.digest === 'string' &&
          error.digest.startsWith('NEXT_REDIRECT')
        ) {
          throw error;
        }

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Email verification failed',
        );
      }
    },
  });

  const emailValue = form.state.values.email;

  const handleResendOtp = async () => {
    if (!emailValue) {
      toast.error('Email is required to resend OTP');
      return;
    }

    try {
      const result = await resendOtpMutateAsync(emailValue);

      if (!result.success) {
        toast.error(result.message || 'Failed to resend OTP');
        return;
      }

      toast.success(result.message || 'OTP sent successfully');
      setResendCooldown(30);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to resend OTP',
      );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to your email to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: verifyEmailZodSchema.shape.email }}
          >
            {field => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field
            name="otp"
            validators={{ onChange: verifyEmailZodSchema.shape.otp }}
          >
            {field => (
              <AppField
                field={field}
                label="OTP"
                type="text"
                placeholder="Enter 6-digit OTP"
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={s => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Verifying..."
                disabled={!canSubmit}
              >
                Verify Email
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Did not get OTP?</span>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              disabled={isResendingOtp || resendCooldown > 0}
              onClick={handleResendOtp}
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend OTP'}
            </Button>
          </div>
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailForm;
