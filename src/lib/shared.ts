import { createGetUrl } from 'fumadocs-core/source';

export const appName = '简幻欢社区维基';
export const siteUrl = new URL('https://next.simpdoc.top/');
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx';

export const gitConfig = {
  user: 'simpdoc',
  repo: 'simpfun-wiki',
  branch: 'main',
};

export function getPageMarkdownUrl(page: { url: string }) {
  return `${docsContentRoute}${page.url.replace(/\/$/, '')}.md`;
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
