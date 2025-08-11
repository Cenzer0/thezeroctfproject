import * as React from 'react';
import { cn } from '../lib/cn';

export function Form({ children, className, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLFormElement>>) {
  return (
    <form className={cn('space-y-4', className)} {...props}>
      {children}
    </form>
  );
}
