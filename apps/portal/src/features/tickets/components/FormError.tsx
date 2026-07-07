export function FormError({ error }: { error: Error | null }) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {error.message || 'Something went wrong. Please try again.'}
    </div>
  );
}
