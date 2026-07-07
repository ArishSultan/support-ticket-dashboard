import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '#/components/ui/field';
import { TextField } from '#/components/form/TextField';
import { LoadingButton } from '#/components/form/LoadingButton';
import { TanstackField } from '#/components/form/TanstackField';
import { AuthErrorBanner } from '#/components/AuthError';
import { PasswordStrengthField } from '#/components/PasswordStrengthField';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group';

import { useSignUpForm } from '../hooks/useSignUpForm';

export function SignUpForm() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { form, isSubmitting, error, resetError } = useSignUpForm();

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

        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <form.Field
              name="firstName"
              children={(field) => (
                <TextField
                  type="text"
                  field={field}
                  disabled={isSubmitting}
                  placeholder="Jane"
                  autoComplete="given-name"
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
            <form.Field
              name="lastName"
              children={(field) => (
                <TextField
                  type="text"
                  field={field}
                  disabled={isSubmitting}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              )}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <form.Field
            name="email"
            children={(field) => (
              <TextField
                type="email"
                field={field}
                disabled={isSubmitting}
                placeholder="you@company.com"
                autoComplete="email"
              />
            )}
          />
        </Field>

        <form.Field
          name="password"
          children={(field) => <PasswordStrengthField field={field} />}
        />

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <form.Field
            name="confirmPassword"
            children={(field) => (
              <TanstackField field={field}>
                <InputGroup>
                  <InputGroupInput
                    id="confirmPassword"
                    name="confirmPassword"
                    disabled={isSubmitting}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-type your password"
                    autoComplete="new-password"
                    aria-invalid={!field.state.meta.isValid}
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    aria-pressed={showConfirm}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? (
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

        <Field>
          <LoadingButton
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            loadingChildren="Creating account"
          >
            Create account
          </LoadingButton>
          <FieldDescription className="text-center">
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
