import { useMemo, useState } from 'react';
import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import { Check, X, EyeOff, Eye } from 'lucide-react';

import { Field, FieldLabel } from '#/components/ui/field';

import { TanstackField } from './form/TanstackField';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
];

function getStrengthColor(score: number) {
  if (score === 0) return 'bg-border';
  if (score <= 1) return 'bg-red-500';
  if (score <= 2) return 'bg-orange-500';
  if (score === 3) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getStrengthText(score: number) {
  if (score === 0) return 'Enter a password';
  if (score <= 2) return 'Weak password';
  if (score === 3) return 'Medium password';
  return 'Strong password';
}

interface PasswordStrengthFieldProps {
  field: AnyFieldApi;
  disabled?: boolean;
}

export function PasswordStrengthField({
  field,
  disabled,
}: PasswordStrengthFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const value = field.state.value as string;

  const strength = useMemo(
    () =>
      requirements.map((req) => ({
        met: req.regex.test(value),
        text: req.text,
      })),
    [value],
  );

  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength],
  );

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
      <div className="relative">
        <TanstackField field={field}>
          <InputGroup>
            <InputGroupInput
              id="password"
              name="password"
              disabled={disabled}
              type={isVisible ? 'text' : 'password'}
              placeholder="Type your password"
              autoComplete="new-password"
              aria-invalid={!field.state.meta.isValid}
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={(e) => {
                if (!hasInteracted) {
                  setHasInteracted(true);
                }

                field.handleChange(e.target.value);
              }}
            />
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              aria-pressed={isVisible}
              aria-label={isVisible ? 'Hide password' : 'Show password'}
              onClick={() => setIsVisible((v) => !v)}
            >
              {isVisible ? (
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

        {!disabled && hasInteracted && (
          <>
            <div
              className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Password strength"
            >
              <div
                className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                style={{ width: `${(strengthScore / 4) * 100}%` }}
              />
            </div>

            <p
              id="password-strength-description"
              className="text-foreground mb-2 text-sm font-medium"
            >
              {getStrengthText(strengthScore)}. Must contain:
            </p>

            <ul className="space-y-1.5" aria-label="Password requirements">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <Check
                      aria-hidden="true"
                      className="h-4 w-4 text-emerald-500"
                    />
                  ) : (
                    <X
                      aria-hidden="true"
                      className="text-muted-foreground/80 h-4 w-4"
                    />
                  )}
                  <p
                    className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                  >
                    {req.text}
                    <span className="sr-only">
                      {req.met
                        ? ' - Requirement met'
                        : ' - Requirement not met'}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Field>
  );
}
