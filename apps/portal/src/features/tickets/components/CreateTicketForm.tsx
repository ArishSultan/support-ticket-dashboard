'use client';

import { TextField } from '#/components/form/TextField';
import { SelectField } from '#/components/form/SelectField';
import { TextareaField } from '#/components/form/TextareaField';
import { LoadingButton } from '#/components/form/LoadingButton';
import { Field, FieldLabel, FieldGroup } from '#/components/ui/field';

import { FormError } from './FormError';

import { PRIORITY_OPTIONS } from '../lib/ticket-options';
import { useAssigneeOptions } from '../hooks/useAssigneeOptions';
import { useCreateTicketForm } from '../hooks/useCreateTicketForm';

export function CreateTicketForm({
  onSuccessAction,
}: {
  onSuccessAction?: () => void;
}) {
  const assigneeOptions = useAssigneeOptions();
  const { form, isSubmitting, error } = useCreateTicketForm({
    onSuccess: onSuccessAction,
  });

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
              <TextField
                field={field}
                disabled={isSubmitting}
                placeholder="Unable to complete checkout"
              />
            )}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="customerName">Customer Name</FieldLabel>
            <form.Field
              name="customerName"
              children={(field) => (
                <TextField
                  field={field}
                  disabled={isSubmitting}
                  placeholder="Jane Doe"
                />
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
                  placeholder="jane@example.com"
                />
              )}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <form.Field
            name="description"
            children={(field) => (
              <TextareaField
                rows={4}
                field={field}
                disabled={isSubmitting}
                placeholder="Please describe the customer support query in detail..."
              />
            )}
          />
        </Field>

        <LoadingButton
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingChildren="Creating"
        >
          Create Ticket
        </LoadingButton>
      </FieldGroup>
    </form>
  );
}
