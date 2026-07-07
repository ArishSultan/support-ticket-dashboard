'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { TextField } from '#/components/form/TextField';
import { LoadingButton } from '#/components/form/LoadingButton';
import { TanstackField } from '#/components/form/TanstackField';
import { AuthErrorBanner } from '#/components/AuthError';
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from '#/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group';

import { useSignInForm } from '../hooks/useSignInForm';

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, isSubmitting, error, resetError } = useSignInForm();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <AuthErrorBanner error={error} onDismiss={resetError} />

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <form.Field
            name="email"
            children={(field) => (
              <TextField
                type="email"
                field={field}
                disabled={isSubmitting}
                placeholder="Type your email"
                autoComplete="email webauthn"
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <form.Field
            name="password"
            children={(field) => (
              <TanstackField field={field}>
                <InputGroup aria-disabled={isSubmitting}>
                  <InputGroupInput
                    id="password"
                    name="password"
                    disabled={isSubmitting}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Type your password"
                    autoComplete="current-password"
                    aria-invalid={!field.state.meta.isValid}
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    aria-pressed={showPassword}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff
                        strokeWidth={2}
                        aria-hidden="true"
                        className="text-muted-foreground h-5 w-5"
                      />
                    ) : (
                      <Eye
                        strokeWidth={2}
                        aria-hidden="true"
                        className="text-muted-foreground h-5 w-5"
                      />
                    )}
                    <span className="sr-only">Toggle Visibility</span>
                  </InputGroupAddon>
                </InputGroup>
              </TanstackField>
            )}
          />
        </Field>

        <LoadingButton
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingChildren="Signing in"
        >
          Sign in
        </LoadingButton>

        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
