import type { Root } from 'fumadocs-core/page-tree';
import { docsRoute } from './shared';

export interface DocsSection {
  slug: string;
  name: string;
  description?: string;
  url: string;
}

export function collectDocsSections(tree: Root): DocsSection[] {
  return tree.children.flatMap((node) => {
    if (node.type !== 'folder' || !node.$ref || typeof node.name !== 'string') return [];

    const slug = node.$ref.folder;
    return [
      {
        slug,
        name: node.name,
        description: typeof node.description === 'string' ? node.description : undefined,
        url: `${docsRoute}/${slug}`,
      },
    ];
  });
}
