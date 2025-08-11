import * as React from 'react';
import { cn } from '../lib/cn';

export function Tag({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <span className={cn('inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs', className)}>{children}</span>;
}
