'use client';
import SearchDialog, { DocsSectionsProvider } from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { translations } from '@/lib/layout.shared';
import type { DocsSection } from '@/lib/docs-sections';
import { type ReactNode } from 'react';

export function Provider({ sections, children }: { sections: DocsSection[]; children: ReactNode }) {
  return (
    <DocsSectionsProvider sections={sections}>
      <RootProvider i18n={i18nProvider(translations)} search={{ SearchDialog }}>
        {children}
      </RootProvider>
    </DocsSectionsProvider>
  );
}
