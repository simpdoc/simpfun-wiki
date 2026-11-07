import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DefaultNotFound } from 'fumadocs-ui/layouts/home/not-found';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { collectDocsSections } from '@/lib/docs-sections';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '找不到页面',
};

export default function NotFound() {
  return (
    <HomeLayout
      {...baseOptions()}
      links={collectDocsSections(source.getPageTree()).map((section) => ({
        text: section.name,
        url: section.url,
      }))}
    >
      <div className="not-found-content flex flex-1">
        <DefaultNotFound />
      </div>
    </HomeLayout>
  );
}
