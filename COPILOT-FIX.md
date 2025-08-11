Kamu adalah Repo Doctor. Tugasmu: perbaiki build & lint monorepo ini sampai pnpm -w run lint && pnpm -w run typecheck && pnpm -w run build sukses tanpa error.

Target perbaikan
	1.	csurf: package apps/api minta csurf@^1.14.0 (nggak ada). Ganti ke ^1.11.0.
	2.	Prisma: prisma generate gagal karena schema tidak ditemukan. Letakkan schema di packages/db/prisma/schema.prisma, mapping di @ctf/db/package.json → "prisma.schema": "packages/db/prisma/schema.prisma", dan buat export client packages/db/src/client.ts.
	3.	ESLint v9 (flat config): proyek masih pakai .eslintrc/opsi CLI lama. Migrasi ke eslint.config.mjs (root + web).
	4.	Scripts: tambahkan typecheck di tiap package; rapikan lint/build konsisten.
	5.	@ctf/ui build: error karena @tanstack/react-table belum terpasang dan ada implicit any. Tambah dep & strong typing.
	6.	tsconfig konsisten (base di root, extend di setiap package).
	7.	Turbo pipeline cukup untuk build/typecheck.

Lakukan perubahan berikut (tulis/ubah file persis):

A. Dependencies
	•	apps/api/package.json: ganti dependency csurf ke "csurf": "^1.11.0".
	•	packages/ui/package.json: tambahkan dependency "@tanstack/react-table": "^8".

B. Prisma

Buat file packages/db/prisma/schema.prisma (boleh mulai minimal, nanti disesuaikan):

generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id           String   @id @default(cuid())
  username     String   @unique
  email        String   @unique
  passwordHash String
  role         String
  createdAt    DateTime @default(now())
}

packages/db/package.json tambahkan:

{
  "name": "@ctf/db",
  "prisma": { "schema": "packages/db/prisma/schema.prisma" },
  "scripts": {
    "prisma:generate": "prisma generate --schema packages/db/prisma/schema.prisma",
    "prisma:validate": "prisma validate --schema packages/db/prisma/schema.prisma",
    "build": "echo \"no build for db\""
  }
}

packages/db/src/client.ts:

import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export default prisma;

C. ESLint (flat config v9)

Root eslint.config.mjs:

import js from '@eslint/js';
export default [
  { ignores: ['**/dist/**','**/.next/**','**/node_modules/**'] },
  {
    files: ['apps/api/**/*.{ts,tsx}','packages/ui/**/*.{ts,tsx}','packages/db/**/*.{ts,tsx}'],
    languageOptions: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },
    rules: { ...js.configs.recommended.rules, 'no-unused-vars': ['error',{ argsIgnorePattern:'^_' }] }
  }
];

Next.js web apps/web/eslint.config.mjs:

import next from 'eslint-config-next';
export default [{ ignores: ['.next/**','dist/**'] }, ...next()];

Hapus file .eslintrc.* lama & opsi CLI yang deprecated.

D. Scripts per package

Root package.json:

{
  "scripts": {
    "lint": "turbo run lint --continue",
    "typecheck": "turbo run typecheck --continue",
    "build": "turbo run build",
    "prisma:gen": "pnpm -w --filter @ctf/db run prisma:generate"
  }
}

apps/api/package.json:

{ "scripts": {
  "lint": "eslint .",
  "typecheck": "tsc -p tsconfig.json --noEmit",
  "build": "nest build"
} }

apps/web/package.json:

{ "scripts": {
  "lint": "next lint",
  "typecheck": "tsc -p tsconfig.json --noEmit",
  "build": "next build"
} }

packages/ui/package.json:

{ "scripts": {
  "lint": "eslint .",
  "typecheck": "tsc -p tsconfig.json --noEmit",
  "build": "tsup src/index.ts --dts --format cjs,esm --out-dir dist"
} }

E. UI DataTable typing (hapus implicit any)

packages/ui/src/components/datatable/index.tsx:

import * as React from 'react';
import {
  ColumnDef, flexRender, getCoreRowModel, useReactTable,
  HeaderGroup, Header, Row, Cell
} from '@tanstack/react-table';

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData, any>[];
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

F. tsconfig

Root tsconfig.base.json:

{
  "compilerOptions": {
    "target":"ES2022","module":"ESNext","moduleResolution":"Bundler",
    "strict":true,"skipLibCheck":true,"jsx":"react-jsx","baseUrl":"." }
}

Di tiap package tsconfig.json:

{ "extends":"../../tsconfig.base.json","compilerOptions":{"outDir":"dist"},"include":["./**/*"] }

G. Turborepo

turbo.json:

{
  "pipeline": {
    "lint": { "outputs": [] },
    "typecheck": { "dependsOn":["^typecheck"], "outputs": [] },
    "build": { "dependsOn":["^build"], "outputs": ["dist/**",".next/**"] }
  }
}

Acceptance criteria
	•	pnpm -w install sukses (csurf resolved ke ^1.11.0).
	•	pnpm -w run prisma:gen sukses (schema ditemukan).
	•	pnpm -w run lint sukses (tanpa error opsi deprecated).
	•	pnpm -w run typecheck sukses (tanpa implicit any di UI).
	•	pnpm -w run build sukses (tsup UI & nest build jalan).

Setelah mengedit file di atas, jalankan perintah ini:

pnpm -w install
pnpm -w run prisma:gen
pnpm -w run lint
pnpm -w run typecheck
pnpm -w run build

Jika masih ada error residual (max 3–5), tampilkan nama file + baris + pesan lalu perbaiki sampai semua hijau.
