import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { appName } from '@/lib/shared';
import { source } from '@/lib/source';
import { collectDocsSections } from '@/lib/docs-sections';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  icons: {
    icon: '/img/favicon.ico',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider sections={collectDocsSections(source.getPageTree())}>{children}</Provider>
      </body>
    </html>
  );
}
