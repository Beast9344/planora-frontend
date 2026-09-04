'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from '@/app/(commonLayout)/(auth)/register/_action';
import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IRegisterPayload, registerZodSchema } from '@/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';

interface RegisterFormProps {
  redirectPath?: string;
}

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      registerAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },

    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          toast.error(result.message || 'Registration failed');
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
            'Registration failed',
        );
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Create Your Account
        </CardTitle>
        <CardDescription>
          Register now to start managing your events.
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
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {field => (
              <AppField
                field={field}
                label="Full Name"
                type="text"
                placeholder="Enter your name"
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
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
            validators={{ onChange: registerZodSchema.shape.password }}
          >
            {field => (
              <AppField
                field={field}
                label="Password"
                type="password"
                placeholder="Create a password"
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={s => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Creating account..."
                disabled={!canSubmit}
              >
                Register
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
