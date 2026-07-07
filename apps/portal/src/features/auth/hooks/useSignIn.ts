import { useMutation } from '@tanstack/react-query';

import { auth } from '#/lib/auth';
import { SignInFormValues } from './useSignInForm';

export function useSignIn() {
  return useMutation({
    mutationKey: ['signIn'],
    async mutationFn(values: SignInFormValues) {
      const result = await auth.signIn.email(values);
      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
  });
}
