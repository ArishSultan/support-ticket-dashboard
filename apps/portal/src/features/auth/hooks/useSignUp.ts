import { useMutation } from '@tanstack/react-query';

import { auth } from '#/lib/auth';
import type { SignUpFormValues } from './useSignUpForm';

export function useSignUp() {
  return useMutation({
    mutationKey: ['signUp'],
    async mutationFn(values: SignUpFormValues) {
      const name =
        `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
      const result = await auth.signUp.email({
        name,
        email: values.email,
        password: values.password,
      } as Parameters<typeof auth.signUp.email>[0]);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
  });
}
