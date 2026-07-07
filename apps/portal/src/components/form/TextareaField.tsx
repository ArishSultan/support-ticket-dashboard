import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import type { TextareaHTMLAttributes } from 'react';

import { Textarea } from '../ui/textarea';
import { TanstackField } from './TanstackField';

export type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  field: AnyFieldApi;
};

export function TextareaField({ field, ...props }: TextareaFieldProps) {
  return (
    <TanstackField field={field}>
      <Textarea
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
