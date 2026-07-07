import { z } from 'zod';
import { toast } from 'sonner';
import { useSelector } from '@tanstack/react-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { revalidateLogic, useForm } from '@tanstack/react-form-nextjs';

import { useSignUp } from './useSignUp';

export const signUpValidationSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Provide a valid email'),
    password: z
      .string('Password is required')
      .min(8, 'At least 8 characters are required')
      .regex(/[0-9]/, 'At least 1 number')
      .regex(/[a-z]/, 'At least 1 lowercase letter')
      .regex(/[A-Z]/, 'At least 1 uppercase letter'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignUpFormValues = z.infer<typeof signUpValidationSchema>;

export const signUpFormDefaultValues: SignUpFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function useSignUpForm() {
  const router = useRouter();
  const signUp = useSignUp();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm({
    defaultValues: signUpFormDefaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: signUpValidationSchema },
    onSubmit: async ({ value }) => {
      signUp.reset();
      await signUp.mutateAsync(value);

      toast.success('Account created successfully');
      setTimeout(() => router.push(callbackUrl ?? '/'), 400);
    },
    listeners: {
      onChange: () => {
        if (signUp.error) {
          signUp.reset();
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
    error: signUp.error,
    resetError: signUp.reset,
  };
}
