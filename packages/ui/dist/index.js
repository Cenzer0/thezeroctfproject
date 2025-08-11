"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Badge: () => Badge,
  CodeBlock: () => CodeBlock,
  Countdown: () => Countdown,
  DataTable: () => DataTable,
  Form: () => Form,
  Markdown: () => Markdown,
  TBody: () => TBody,
  TD: () => TD,
  TH: () => TH,
  THead: () => THead,
  TR: () => TR,
  Table: () => Table,
  Tag: () => Tag,
  cn: () => cn
});
module.exports = __toCommonJS(index_exports);

// src/lib/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/table.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Table({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", { className: cn("w-full text-sm", className), children });
}
function THead({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { className: cn("text-left text-muted-foreground", className), children });
}
function TBody({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { className: cn("divide-y divide-border", className), children });
}
function TR({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { className: cn("hover:bg-muted/40", className), children });
}
function TH({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: cn("px-3 py-2 font-medium", className), children });
}
function TD({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: cn("px-3 py-2", className), children });
}

// src/components/form.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Form({ children, className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("form", { className: cn("space-y-4", className), ...props, children });
}

// src/components/tag.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function Tag({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: cn("inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs", className), children });
}

// src/components/badge.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function Badge({ children, className, variant = "default" }) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: cn("inline-flex items-center rounded px-2 py-1 text-xs font-medium", variants[variant], className), children });
}

// src/components/code-block.tsx
var import_react_markdown = __toESM(require("react-markdown"));
var import_rehype_raw = __toESM(require("rehype-raw"));
var import_rehype_prism_plus = __toESM(require("rehype-prism-plus"));
var import_jsx_runtime5 = require("react/jsx-runtime");
function CodeBlock({ code, language = "tsx", className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("pre", { className: cn("rounded-md border bg-muted p-4 text-sm overflow-auto", className), children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { className: `language-${language}`, children: code }) });
}
function Markdown({ content, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: cn("prose dark:prose-invert max-w-none", className), children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react_markdown.default, { rehypePlugins: [import_rehype_raw.default, import_rehype_prism_plus.default], children: content }) });
}

// src/components/datatable/index.tsx
var import_react_table = require("@tanstack/react-table");
var import_jsx_runtime6 = require("react/jsx-runtime");
function DataTable({ columns, data }) {
  const table = (0, import_react_table.useReactTable)({ data, columns, getCoreRowModel: (0, import_react_table.getCoreRowModel)() });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("table", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("thead", { children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("tr", { children: hg.headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("th", { children: h.isPlaceholder ? null : (0, import_react_table.flexRender)(h.column.columnDef.header, h.getContext()) }, h.id)) }, hg.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("tbody", { children: table.getRowModel().rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("tr", { children: r.getVisibleCells().map((c) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("td", { children: (0, import_react_table.flexRender)(c.column.columnDef.cell, c.getContext()) }, c.id)) }, r.id)) })
  ] });
}

// src/components/countdown.tsx
var React = __toESM(require("react"));
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className, children: [
    m,
    ":",
    seconds.toString().padStart(2, "0")
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
