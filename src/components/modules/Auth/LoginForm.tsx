'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from '@/app/(commonLayout)/(auth)/login/_action';
import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ILoginPayload, loginZodSchema } from '@/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface LoginFormProps {
  redirectPath?: string;
}

const DEMO_CREDENTIALS = {
  user: {
    email: 'asadulimran1998@gmail.com',
    password: 'asad.emran',
  },
  admin: {
    email: 'asadulimran1999@gmail.com',
    password: 'asad.emran',
  },
} as const;

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || 'Login failed');
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

        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  const applyDemoCredentials = (role: 'user' | 'admin') => {
    const credentials = DEMO_CREDENTIALS[role];
    setServerError(null);
    form.setFieldValue('email', credentials.email);
    form.setFieldValue('password', credentials.password);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>
          Please enter your credentials to log in.
        </CardDescription>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => applyDemoCredentials('user')}
          >
            Demo User Login
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => applyDemoCredentials('admin')}
          >
            Demo Admin Login
          </Button>
        </div>
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
            validators={{ onChange: loginZodSchema.shape.email }}
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
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {field => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="cursor-pointer"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <Alert variant={'destructive'}>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={s => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Logging In...."
                disabled={!canSubmit}
              >
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const redirect = redirectPath
              ? `?redirect=${encodeURIComponent(redirectPath)}`
              : '';
            window.location.href = `${baseUrl}/auth/login/google${redirect}`;
          }}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign Up for an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
