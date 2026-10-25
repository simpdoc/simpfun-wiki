import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { collectDocsSections } from '@/lib/docs-sections';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={collectDocsSections(source.getPageTree()).map((section) => ({
        text: section.name,
        url: section.url,
      }))}
    >
      {children}
    </HomeLayout>
  );
}
