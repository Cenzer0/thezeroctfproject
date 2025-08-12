import * as React from 'react';
import {
  ColumnDef, flexRender, getCoreRowModel, useReactTable,
  HeaderGroup, Header, Row, Cell
} from '@tanstack/react-table';

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
};

export function DataTable<TData extends object>({ columns, data }: DataTableProps<TData>) {
  const table = useReactTable<TData>({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg: HeaderGroup<TData>) => (
          <tr key={hg.id}>
            {hg.headers.map((h: Header<TData, unknown>) => (
              <th key={h.id}>
                {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((r: Row<TData>) => (
          <tr key={r.id}>
            {r.getVisibleCells().map((c: Cell<TData, unknown>) => (
              <td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
