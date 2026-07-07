import { Suspense } from 'react';

import { TicketsView } from '#/features/tickets/components/TicketsView';

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-muted-foreground">
          Loading tickets...
        </div>
      }
    >
      <TicketsView />
    </Suspense>
  );
}
