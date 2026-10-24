import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';
import { source } from '@/lib/source';
import { appName } from '@/lib/shared';

export const metadata: Metadata = {
  title: { absolute: appName },
  description: 'Not Official, but still useful.',
};

const docEntries = [
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

const features = [
  {
    icon: BookOpen,
    title: '社区维基',
    description: '源码在 GitHub 开源，欢迎加入我们的编写。',
  },
  {
    icon: HeartHandshake,
    title: '完全免费',
    description: '所有内容均可自由免费查阅，不需要一分钱。',
  },
  {
    icon: Sparkles,
    title: '最新内容',
    description: '本维基已同步 SFE v4.0 的信息。',
  },
];

const footerLinks = [
  {
    title: '文档列表',
    items: docEntries.map((doc) => ({ label: doc.title, href: doc.href })),
  },
  {
    title: '官方链接',
    items: [
      { label: '简幻欢官网', href: 'https://simpfun.cn/' },
      { label: '简幻云官网', href: 'https://v2.simpcloud.cn/' },
      { label: '简幻欢官方文档', href: 'https://www.yuque.com/simpfun/sfe/main' },
      { label: 'Bilibili 主页', href: 'https://space.bilibili.com/1493209225' },
    ],
  },
  {
    title: '更多',
    items: [
      { label: '简幻欢第三方镜像文档', href: 'https://doc.ideafox.top/' },
      { label: 'GitHub', href: 'https://github.com/simpdoc/simpfun-wiki' },
    ],
  },
];

function isExternal(href: string) {
  return href.startsWith('http');
}

export default function HomePage() {
  const pages = source.getPages();

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-20 pb-16 text-center md:pt-28">
        <p className="rounded-full border bg-fd-card px-3 py-1 text-xs text-fd-muted-foreground">
          Not Official, but still useful.
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">简幻欢社区维基</h1>
        <p className="mt-5 max-w-2xl text-fd-muted-foreground md:text-lg">
          简幻欢与简幻云的社区文档，涵盖官网使用、MCJE 与 MCBE 服务端配置和常见操作。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {docEntries.map((doc, index) => (
            <Link
              key={doc.href}
              href={doc.href}
              className={
                index === 0
                  ? 'rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90'
                  : 'rounded-lg border bg-fd-card px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent/60'
              }
            >
              {doc.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {docEntries.map((doc) => {
            const count = pages.filter((page) => page.slugs[0] === doc.id).length;

            return (
              <Link
                key={doc.href}
                href={doc.href}
                className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{doc.title}</h2>
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
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border p-5">
              <div className="flex size-10 items-center justify-center rounded-lg border bg-fd-secondary">
                <Icon className="size-5 text-fd-muted-foreground" />
              </div>
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t bg-fd-card/40">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    {isExternal(item.href) ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t px-4 py-4 text-center text-xs text-fd-muted-foreground">
          <p>Copyright © {new Date().getFullYear()} 简幻欢社区维基</p>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-fd-foreground"
          >
            黑ICP备2024025211号-2
          </a>
        </div>
      </footer>
    </main>
  );
}
