'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSelector } from '@tanstack/react-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { revalidateLogic, useForm } from '@tanstack/react-form-nextjs';

import { useSignIn } from '#/features/auth/hooks/useSignIn';

export const signInValidationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInFormValues = z.infer<typeof signInValidationSchema>;

export const signInFormDefaultValues: SignInFormValues = {
  email: '',
  password: '',
};

export function useSignInForm() {
  const router = useRouter();
  const signIn = useSignIn();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm({
    validationLogic: revalidateLogic(),
    defaultValues: signInFormDefaultValues,
    validators: { onDynamic: signInValidationSchema },
    onSubmit: async ({ value }) => {
      signIn.reset();
      await signIn.mutateAsync(value);

      toast.success('Signed in successfully');
      setTimeout(() => router.push(callbackUrl ?? '/'), 600);
    },
    listeners: {
      onChange: () => {
        if (signIn.error) {
          signIn.reset();
        }
      },
    },
  });

  const isSubmitting = useSelector(
    form.store,
    ({ isSubmitting }) => isSubmitting,
  );
  const isEdited = useSelector(
    form.store,
    ({ isDefaultValue }) => !isDefaultValue,
  );

  return {
    form,
    isEdited,
    isSubmitting,
    errorDialogOpen,
    setErrorDialogOpen,
    error: signIn.error,
    resetError: signIn.reset,
  };
}
