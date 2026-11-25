'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BotIcon, CheckIcon, CopyIcon, ExternalLinkIcon, GraduationCapIcon } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { siteUrl } from '@/lib/shared';

const aiLinkItems = [
  { title: '使用教程：在 AI 中使用本维基', href: '/docs/ai', internal: true },
  { title: '全站索引 llms.txt', href: '/llms.txt', internal: false },
  { title: '全站全文 llms-full.txt', href: '/llms-full.txt', internal: false },
];

export function AiView({ markdownUrl }: { markdownUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const absoluteUrl = `${siteUrl.origin}${markdownUrl}`;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
    } catch {
      window.prompt('复制本页 Markdown 链接：', absoluteUrl);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`${buttonVariants({ variant: 'secondary', size: 'sm' })} gap-2 data-[popup-open]:bg-fd-accent data-[popup-open]:text-fd-accent-foreground`}
      >
        <BotIcon className="size-3.5" />
        让 AI 查看
      </PopoverTrigger>
      <PopoverContent className="flex w-72 flex-col gap-1 p-2" align="start">
        <p className="p-2 text-xs text-fd-muted-foreground">
          将本页 Markdown 交给 AI 阅读，即可基于本页内容直接提问。
        </p>
        <button
          type="button"
          onClick={copyLink}
          className="flex w-full items-center gap-2 rounded-lg p-2 text-start text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          {copied ? (
            <CheckIcon className="size-4 text-fd-primary" />
          ) : (
            <CopyIcon className="size-4" />
          )}
          {copied ? '已复制本页 Markdown 链接' : '复制本页 Markdown 链接'}
        </button>
        {aiLinkItems.map((item) =>
          item.internal ? (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <GraduationCapIcon className="size-4" />
              {item.title}
            </Link>
          ) : (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <BotIcon className="size-4" />
              {item.title}
              <ExternalLinkIcon className="ms-auto size-3.5 text-fd-muted-foreground" />
            </a>
          ),
        )}
      </PopoverContent>
    </Popover>
  );
}
