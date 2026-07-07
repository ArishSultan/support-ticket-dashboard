import { useCallback } from 'react';
import {
  X,
  Ban,
  LogOut,
  WifiOff,
  RotateCw,
  ChevronLeft,
  ClockFading,
  TriangleAlert,
} from 'lucide-react';

import { BetterAuthError, resolveAuthError } from '#/lib/auth-error';

import { Button } from '#/components/ui/button';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '#/components/ui/card';
import { useRouter } from 'next/navigation';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password. Please try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'The password you entered is incorrect.',
  EMAIL_PASSWORD_DISABLED: 'Email and password sign-in is not enabled.',
  EMAIL_NOT_VERIFIED:
    'Please verify your email before signing in. Check your inbox for a verification link.',
  ACCOUNT_NOT_FOUND: 'No account found with this email.',
  USER_NOT_FOUND: 'No account found with these credentials.',
  USER_ALREADY_EXISTS:
    'An account with this email already exists. Try signing in instead.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    'An account with this email already exists. Please use a different email.',
  PASSWORD_TOO_SHORT: 'Password is too short. Please use a longer password.',
  PASSWORD_TOO_LONG: 'Password is too long. Please use a shorter password.',
  WEAK_PASSWORD:
    'This password is too weak. Use a mix of letters, numbers, and symbols.',
  SIGNUP_DISABLED: 'Sign-up is currently disabled. Please try again later.',
  USERNAME_IS_ALREADY_TAKEN:
    'This username is already taken. Please try another.',
  USERNAME_TOO_SHORT: 'Username is too short.',
  USERNAME_TOO_LONG: 'Username is too long.',
  INVALID_USERNAME: 'Username is invalid.',
  INVALID_USERNAME_OR_PASSWORD: 'Invalid username or password.',
  PROVIDER_NOT_FOUND: 'This sign-in provider is not available.',
  UNABLE_TO_GET_USER_INFO:
    "We couldn't retrieve your account info from the provider. Please try again.",
  UNABLE_TO_LINK_ACCOUNT:
    "We couldn't link this account. It may already be linked to another user.",
  ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER:
    'This social account is already linked to a different user.',
  INVALID_TOKEN:
    'This link has expired or is invalid. Please request a new one.',
  TOO_MANY_REQUESTS: 'Too many attempts. Please wait a moment and try again.',
  UNAUTHORIZED: 'Invalid credentials. Please check your email and password.',
  FORBIDDEN: "You don't have permission to perform this action.",
  BAD_REQUEST: 'Something was wrong with your request. Please try again.',
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

function extractErrorMessage(error: unknown): string {
  if (!error) return '';

  if (typeof error === 'object') {
    const err = error as Record<string, unknown>;

    const code =
      (err.code as string) ??
      (err.statusText as string) ??
      (
        (err.response as Record<string, unknown>)?.data as Record<
          string,
          unknown
        >
      )?.code ??
      (
        (err.response as Record<string, unknown>)?.data as Record<
          string,
          unknown
        >
      )?.statusText;

    if (code in ERROR_MESSAGES) {
      return ERROR_MESSAGES[code];
    }

    const message =
      (err.message as string) ??
      (
        (err.response as Record<string, unknown>)?.data as Record<
          string,
          unknown
        >
      )?.message;

    if (message?.length > 0 && message?.length < 200) {
      return message;
    }
  }

  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    if (cause) {
      return extractErrorMessage(cause);
    }

    if (
      error.message === 'Failed to fetch' ||
      error.message === 'Network request failed'
    ) {
      return 'Unable to connect. Please check your internet connection and try again.';
    }

    const status = (error as unknown as Record<string, unknown>).status;
    if (typeof status === 'number') {
      if (status === 429) return ERROR_MESSAGES.TOO_MANY_REQUESTS;
      if (status === 401) return ERROR_MESSAGES.UNAUTHORIZED;
      if (status === 403) return ERROR_MESSAGES.FORBIDDEN;
    }
  }

  return FALLBACK_MESSAGE;
}

interface AuthErrorBannerProps {
  error: unknown;
  onDismiss?: () => void;
  className?: string;
}

export function AuthErrorBanner({
  error,
  onDismiss,
  className = '',
}: AuthErrorBannerProps) {
  const message = extractErrorMessage(error);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  if (!error || !message) return null;

  return (
    <div
      role="alert"
      className={`border-destructive/30 bg-destructive/10 text-destructive animate-in fade-in slide-in-from-top-1 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm duration-200 ${className}`}
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={handleDismiss}
          className="focus-visible:ring-destructive shrink-0 rounded-sm p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none"
          aria-label="Dismiss error"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function getErrorIcon(status: number, code?: string) {
  if (
    code &&
    [
      'STATE_NOT_FOUND',
      'STATE_MISMATCH',
      'NO_CODE',
      'INVALID_CALLBACK_REQUEST',
      'UNABLE_TO_LINK_ACCOUNT',
      'ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER',
    ].includes(code)
  ) {
    return Ban;
  }

  // Permission / forbidden
  if (
    status === 403 ||
    code === 'EMAIL_NOT_VERIFIED' ||
    code === 'SIGNUP_DISABLED'
  ) {
    return Ban;
  }

  if (status === 408 || status === 429 || code === 'TOO_MANY_REQUESTS') {
    return ClockFading;
  }

  if (status >= 500) {
    return WifiOff;
  }

  return TriangleAlert;
}

interface AuthErrorViewProps {
  error: Error;
  onLogout: () => void;
}

export function AuthErrorPage({ error, onLogout }: AuthErrorViewProps) {
  const router = useRouter();

  const authError: BetterAuthError =
    'details' in error && (error as any).details
      ? (error as any).details
      : { status: 500, statusText: error.message };

  const resolved = resolveAuthError(authError);
  const ErrorIcon = getErrorIcon(resolved.status, resolved.code);

  const handleGoBack = () => {
    router.back();
  };

  const handleRetry = () => {
    void router.refresh();
  };

  return (
    <div className="bg-muted flex h-screen w-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <ErrorIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-lg">{resolved.title}</CardTitle>
          <CardDescription>{resolved.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md bg-zinc-100 p-3 dark:bg-zinc-900">
            <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Error details
            </p>
            <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              {resolved.code && (
                <p>
                  <span className="font-medium text-zinc-500">Code:</span>{' '}
                  <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
                    {resolved.code}
                  </code>
                </p>
              )}
              <p>
                <span className="font-medium text-zinc-500">Status:</span>{' '}
                {resolved.status} {authError.statusText}
              </p>
              {authError.message &&
                authError.message !== resolved.description && (
                  <p>
                    <span className="font-medium text-zinc-500">Message:</span>{' '}
                    {authError.message}
                  </p>
                )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RotateCw className="h-4 w-4" />
            Retry
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onLogout}
            className="ml-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
