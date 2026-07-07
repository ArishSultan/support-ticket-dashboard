import type { ReactNode } from 'react';
import type { AnyFieldApi } from '@tanstack/react-form-nextjs';

export type TanstackFormProps = {
  field: AnyFieldApi;
  children?: ReactNode | ReactNode[];
};

export function TanstackField(props: TanstackFormProps) {
  return (
    <div className="*:not-first:mt-2 w-full">
      {props.children}
      {!props.field.state.meta.isValid && (
        <p
          role="alert"
          aria-live="polite"
          className="text-destructive mt-2 text-xs"
        >
          {formatError(props.field)}
        </p>
      )}
    </div>
  );
}

function formatError(field: AnyFieldApi) {
  return field.state.meta.errors[0].message;
}
