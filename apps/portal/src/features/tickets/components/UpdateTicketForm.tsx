'use client';

import type { TicketEntity } from '@org/api-client';

import { TextField } from '#/components/form/TextField';
import { TextareaField } from '#/components/form/TextareaField';
import { SelectField } from '#/components/form/SelectField';
import { LoadingButton } from '#/components/form/LoadingButton';
import { Field, FieldLabel, FieldGroup } from '#/components/ui/field';

import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../lib/ticket-options';
import { useUpdateTicketForm } from '../hooks/useUpdateTicketForm';
import { useAssigneeOptions } from '../hooks/useAssigneeOptions';
import { FormError } from './FormError';

export function UpdateTicketForm({
  ticket,
  onSuccess,
}: {
  ticket: TicketEntity;
  onSuccess?: () => void;
}) {
  const { form, isSubmitting, error } = useUpdateTicketForm({
    ticket,
    onSuccess,
  });
  const assigneeOptions = useAssigneeOptions();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FormError error={error} />

        <Field>
          <FieldLabel htmlFor="title">Ticket Title</FieldLabel>
          <form.Field
            name="title"
            children={(field) => (
              <TextField field={field} disabled={isSubmitting} />
            )}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="customerName">Customer Name</FieldLabel>
            <form.Field
              name="customerName"
              children={(field) => (
                <TextField field={field} disabled={isSubmitting} />
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="customerEmail">Customer Email</FieldLabel>
            <form.Field
              name="customerEmail"
              children={(field) => (
                <TextField
                  type="email"
                  field={field}
                  disabled={isSubmitting}
                />
              )}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <form.Field
              name="status"
              children={(field) => (
                <SelectField
                  field={field}
                  disabled={isSubmitting}
                  options={STATUS_OPTIONS}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="priority">Priority</FieldLabel>
            <form.Field
              name="priority"
              children={(field) => (
                <SelectField
                  field={field}
                  disabled={isSubmitting}
                  options={PRIORITY_OPTIONS}
                />
              )}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="assignedTo">Assignee</FieldLabel>
          <form.Field
            name="assignedTo"
            children={(field) => (
              <SelectField
                field={field}
                disabled={isSubmitting}
                options={assigneeOptions}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <form.Field
            name="description"
            children={(field) => (
              <TextareaField rows={4} field={field} disabled={isSubmitting} />
            )}
          />
        </Field>

        <LoadingButton
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingChildren="Saving"
        >
          Save Changes
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
