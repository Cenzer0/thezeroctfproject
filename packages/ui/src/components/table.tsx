import * as React from 'react';
import { cn } from '../lib/cn';

export function Table({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <table className={cn('w-full text-sm', className)}>{children}</table>;
}

export function THead({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <thead className={cn('text-left text-muted-foreground', className)}>{children}</thead>;
}

export function TBody({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>;
}

export function TR({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <tr className={cn('hover:bg-muted/40', className)}>{children}</tr>;
}

export function TH({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={cn('px-3 py-2 font-medium', className)}>{children}</th>;
}

export function TD({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={cn('px-3 py-2', className)}>{children}</td>;
}
