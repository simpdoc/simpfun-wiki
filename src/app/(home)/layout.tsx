import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        { text: '官网使用指南', url: '/docs/web/intro' },
        { text: 'MCJE 文档', url: '/docs/mcje/intro' },
        { text: 'MCBE 文档', url: '/docs/mcbe/intro' },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
