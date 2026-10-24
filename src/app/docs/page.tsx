import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { source } from '@/lib/source';

export const metadata: Metadata = {
  title: '选择文档',
};

const entries = [
  {
    id: 'web',
    title: '官网使用指南',
    href: '/docs/web/intro',
  },
  {
    id: 'mcje',
    title: 'MCJE 文档',
    href: '/docs/mcje/intro',
  },
  {
    id: 'mcbe',
    title: 'MCBE 文档',
    href: '/docs/mcbe/intro',
  },
];

export default function DocsIndexPage() {
  const pages = source.getPages();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">选择文档</h1>
      <p className="mt-3 text-fd-muted-foreground">请选择你需要查阅的内容</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {entries.map((entry) => {
          const count = pages.filter((page) => page.slugs[0] === entry.id).length;

          return (
            <Link
              key={entry.href}
              href={entry.href}
              className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent/40"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">{entry.title}</h2>
                <span className="text-xs text-fd-muted-foreground">{count} 篇</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                开始阅读
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
