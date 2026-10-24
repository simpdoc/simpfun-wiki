import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      tabs={{
        transform: (tab) => {
          if (!tab.icon) return tab;
          return {
            ...tab,
            icon: (
              <div className="flex size-full items-center justify-center [&_svg]:size-full [&_img]:size-full [&_img]:object-contain max-md:p-1.5 max-md:rounded-md max-md:border max-md:bg-fd-secondary">
                {tab.icon}
              </div>
            ),
          };
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
