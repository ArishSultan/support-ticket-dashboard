import type { ComponentProps, ReactNode } from 'react';
import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';

import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: ReactNode;
  field: AnyFieldApi;
};

export function CheckboxField({ field, label, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        aria-invalid={!field.state.meta.isValid}
        onCheckedChange={(e) => field.handleChange(Boolean(e))}
        {...props}
      />
      <Label htmlFor={field.name}>{label}</Label>
    </div>
  );
}
