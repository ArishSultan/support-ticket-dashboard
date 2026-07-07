import type { ReactNode } from 'react';
import { cn } from '#/lib/utils';

export type FieldSkeletonProps = {
  label?: boolean;
  labelChild?: ReactNode;
  className?: string;
};

export function FieldSkeleton({
  label = true,
  labelChild,
  className,
}: FieldSkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label &&
        (labelChild ?? <div className="bg-muted h-4 w-36 rounded-sm my-1" />)}
      <div className="bg-muted h-9 rounded-md" />
    </div>
  );
}
