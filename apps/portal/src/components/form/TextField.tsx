import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import type { InputHTMLAttributes } from 'react';

import { Input } from '../ui/input';
import { TanstackField } from './TanstackField';

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  field: AnyFieldApi;
};

export function TextField({ field, ...props }: TextFieldProps) {
  return (
    <TanstackField field={field}>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        aria-invalid={!field.state.meta.isValid}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
    </TanstackField>
  );
}
