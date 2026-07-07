import * as React from 'react';
import { LoaderCircle } from 'lucide-react';

import { Button, buttonVariants } from '../ui/button';
import type { VariantProps } from 'class-variance-authority';
import { AlertDialogAction } from '../ui/alert-dialog';

type LoadingButtonProps = React.ComponentProps<'button'> & {
  isLoading?: boolean;
  loadingChildren?: React.ReactNode | React.ReactNode[];
} & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function LoadingButton({
  children,
  variant = 'default',
  isLoading = false,
  loadingChildren = 'Submitting...',
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} className={className} {...props} variant={variant}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {loadingChildren}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

type LoadingAlertDialogActionProps = React.ComponentProps<typeof Button> & {
  isLoading?: boolean;
  loadingChildren?: React.ReactNode | React.ReactNode[];
};

export function LoadingAlertDialogAction({
  children,
  className,
  isLoading,
  loadingChildren,
  ...props
}: LoadingAlertDialogActionProps) {
  return (
    <AlertDialogAction disabled={isLoading} className={className} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {loadingChildren}
        </span>
      ) : (
        children
      )}
    </AlertDialogAction>
  );
}