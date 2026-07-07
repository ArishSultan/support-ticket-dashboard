import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import type { ReactNode } from 'react';

import { TanstackField } from './TanstackField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export type SelectFieldProps = {
  field: AnyFieldApi;
  options: Array<{ value: string; label: ReactNode }>;
  placeholder?: string;
  disabled?: boolean;
};

export function SelectField({
  field,
  options,
  placeholder,
  disabled,
}: SelectFieldProps) {
  return (
    <TanstackField field={field}>
      <Select
        items={options}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value ?? '')}
        onOpenChange={(open) => {
          if (!open) field.handleBlur();
        }}
      >
        <SelectTrigger
          id={field.name}
          disabled={disabled}
          aria-invalid={!field.state.meta.isValid}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={String(o.value)} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TanstackField>
  );
}
