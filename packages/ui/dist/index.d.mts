import { ClassValue } from 'clsx';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';

declare function cn(...inputs: ClassValue[]): string;

declare function Table({ children, className }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function THead({ children, className }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function TBody({ children, className }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function TR({ children, className }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function TH({ children, className }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;
declare function TD({ children, className }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;

declare function Form({ children, className, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLFormElement>>): react_jsx_runtime.JSX.Element;

declare function Tag({ children, className }: React.PropsWithChildren<{
    className?: string;
}>): react_jsx_runtime.JSX.Element;

declare function Badge({ children, className, variant }: React.PropsWithChildren<{
    className?: string;
    variant?: 'default' | 'secondary' | 'destructive';
}>): react_jsx_runtime.JSX.Element;

declare function CodeBlock({ code, language, className }: {
    code: string;
    language?: string;
    className?: string;
}): react_jsx_runtime.JSX.Element;
declare function Markdown({ content, className }: {
    content: string;
    className?: string;
}): react_jsx_runtime.JSX.Element;

type DataTableProps<TData extends object> = {
    columns: ColumnDef<TData, unknown>[];
    data: TData[];
};
declare function DataTable<TData extends object>({ columns, data }: DataTableProps<TData>): react_jsx_runtime.JSX.Element;

declare function Countdown({ to, onDone, className }: {
    to: Date | number;
    onDone?: () => void;
    className?: string;
}): react_jsx_runtime.JSX.Element;

export { Badge, CodeBlock, Countdown, DataTable, Form, Markdown, TBody, TD, TH, THead, TR, Table, Tag, cn };
