import * as React from 'react';
import { cn } from '../lib/cn';

export function Badge({ children, className, variant = 'default' }: React.PropsWithChildren<{ className?: string; variant?: 'default' | 'secondary' | 'destructive' }>) {
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  };
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-1 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
