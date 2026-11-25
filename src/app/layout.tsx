import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { appName, siteUrl } from '@/lib/shared';
import { source } from '@/lib/source';
import { collectDocsSections } from '@/lib/docs-sections';
import './global.css';
// Shared css chunk for all routes: ImageZoom (used by docs pages) imports the
// same file, so route-prefetch css hints always match a stylesheet that is
// already loaded on every page — no "preloaded but not used" warnings.
import 'fumadocs-ui/components/image-zoom.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
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
