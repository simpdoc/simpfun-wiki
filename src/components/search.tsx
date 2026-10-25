'use client';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useStaticSearch } from 'fumadocs-core/search/client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import type { DocsSection } from '@/lib/docs-sections';

const DocsSectionsContext = createContext<DocsSection[]>([]);

export function DocsSectionsProvider({
  sections,
  children,
}: {
  sections: DocsSection[];
  children: ReactNode;
}) {
  return <DocsSectionsContext.Provider value={sections}>{children}</DocsSectionsContext.Provider>;
}

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n(); // (optional) for i18n
  const sections = useContext(DocsSectionsContext);
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined>();
  const search = useStaticSearch({
    locale,
    tag,
  });

  const items = useMemo<{ name: string; description?: string; value?: string }[]>(
    () => [
      {
        name: '全部',
        value: undefined,
      },
      ...sections.map((section) => ({
        name: section.name,
        description: section.description,
        value: section.slug,
      })),
    ],
    [sections],
  );

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                variant: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">筛选</span>
              {items.find((item) => item.value === tag)?.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {items.map((item, i) => {
                const isSelected = item.value === tag;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(item.value);
                      setOpen(false);
                    }}
                    className={`rounded-lg text-start px-2 py-1.5 ${
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent'
                    }`}
                  >
                    <p className="font-medium mb-0.5">{item.name}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
