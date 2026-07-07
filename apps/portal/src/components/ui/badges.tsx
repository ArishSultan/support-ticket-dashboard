import React from 'react';
import { type VariantProps } from 'class-variance-authority';

import { Badge, badgeVariants } from './badge';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

interface StatusConfig {
  variant: BadgeVariant;
  label: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  open: { variant: 'default', label: 'Open' },
  in_progress: { variant: 'secondary', label: 'In Progress' },
  resolved: { variant: 'outline', label: 'Resolved' },
  closed: { variant: 'ghost', label: 'Closed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const key = status
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

  const config = STATUS_MAP[key] ?? { variant: 'outline', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
interface PriorityConfig {
  variant: BadgeVariant;
  label: string;
}

// One place to declare every priority level. Ordered low -> high.
const PRIORITY_MAP: Record<string, PriorityConfig> = {
  low: { variant: 'secondary', label: 'Low' },
  medium: { variant: 'default', label: 'Medium' },
  high: { variant: 'destructive', label: 'High' },
};

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const key = priority
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

  // unknown priority falls back to "low" to match your original behavior
  const config = PRIORITY_MAP[key] ?? PRIORITY_MAP.low;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
