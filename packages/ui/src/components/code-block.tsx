import * as React from 'react';
import { cn } from '../lib/cn';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypePrism from 'rehype-prism-plus';

export function CodeBlock({ code, language = 'tsx', className }: { code: string; language?: string; className?: string }) {
  return (
    <pre className={cn('rounded-md border bg-muted p-4 text-sm overflow-auto', className)}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn('prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypePrism]}>{content}</ReactMarkdown>
    </div>
  );
}
