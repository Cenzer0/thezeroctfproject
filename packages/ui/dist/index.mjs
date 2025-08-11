// src/lib/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/table.tsx
import { jsx } from "react/jsx-runtime";
function Table({ children, className }) {
  return /* @__PURE__ */ jsx("table", { className: cn("w-full text-sm", className), children });
}
function THead({ children, className }) {
  return /* @__PURE__ */ jsx("thead", { className: cn("text-left text-muted-foreground", className), children });
}
function TBody({ children, className }) {
  return /* @__PURE__ */ jsx("tbody", { className: cn("divide-y divide-border", className), children });
}
function TR({ children, className }) {
  return /* @__PURE__ */ jsx("tr", { className: cn("hover:bg-muted/40", className), children });
}
function TH({ children, className }) {
  return /* @__PURE__ */ jsx("th", { className: cn("px-3 py-2 font-medium", className), children });
}
function TD({ children, className }) {
  return /* @__PURE__ */ jsx("td", { className: cn("px-3 py-2", className), children });
}

// src/components/form.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Form({ children, className, ...props }) {
  return /* @__PURE__ */ jsx2("form", { className: cn("space-y-4", className), ...props, children });
}

// src/components/tag.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function Tag({ children, className }) {
  return /* @__PURE__ */ jsx3("span", { className: cn("inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs", className), children });
}

// src/components/badge.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function Badge({ children, className, variant = "default" }) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground"
  };
  return /* @__PURE__ */ jsx4("span", { className: cn("inline-flex items-center rounded px-2 py-1 text-xs font-medium", variants[variant], className), children });
}

// src/components/code-block.tsx
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import { jsx as jsx5 } from "react/jsx-runtime";
function CodeBlock({ code, language = "tsx", className }) {
  return /* @__PURE__ */ jsx5("pre", { className: cn("rounded-md border bg-muted p-4 text-sm overflow-auto", className), children: /* @__PURE__ */ jsx5("code", { className: `language-${language}`, children: code }) });
}
function Markdown({ content, className }) {
  return /* @__PURE__ */ jsx5("div", { className: cn("prose dark:prose-invert max-w-none", className), children: /* @__PURE__ */ jsx5(ReactMarkdown, { rehypePlugins: [rehypeRaw, rehypePrism], children: content }) });
}

// src/components/datatable/index.tsx
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { jsx as jsx6, jsxs } from "react/jsx-runtime";
function DataTable({ columns, data }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  return /* @__PURE__ */ jsxs("table", { children: [
    /* @__PURE__ */ jsx6("thead", { children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ jsx6("tr", { children: hg.headers.map((h) => /* @__PURE__ */ jsx6("th", { children: h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext()) }, h.id)) }, hg.id)) }),
    /* @__PURE__ */ jsx6("tbody", { children: table.getRowModel().rows.map((r) => /* @__PURE__ */ jsx6("tr", { children: r.getVisibleCells().map((c) => /* @__PURE__ */ jsx6("td", { children: flexRender(c.column.columnDef.cell, c.getContext()) }, c.id)) }, r.id)) })
  ] });
}

// src/components/countdown.tsx
import * as React from "react";
import { jsxs as jsxs2 } from "react/jsx-runtime";
function Countdown({ to, onDone, className }) {
  const [left, setLeft] = React.useState(() => (typeof to === "number" ? to : new Date(to).getTime()) - Date.now());
  React.useEffect(() => {
    const id = setInterval(() => {
      const ms = (typeof to === "number" ? to : new Date(to).getTime()) - Date.now();
      setLeft(ms);
      if (ms <= 0) {
        clearInterval(id);
        onDone?.();
      }
    }, 1e3);
    return () => clearInterval(id);
  }, [to, onDone]);
  const s = Math.max(0, Math.floor(left / 1e3));
  const m = Math.floor(s / 60);
  const seconds = s % 60;
  return /* @__PURE__ */ jsxs2("span", { className, children: [
    m,
    ":",
    seconds.toString().padStart(2, "0")
  ] });
}
export {
  Badge,
  CodeBlock,
  Countdown,
  DataTable,
  Form,
  Markdown,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tag,
  cn
};
