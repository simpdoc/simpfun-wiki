import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Document content images (mostly below-the-fold screenshots) load lazily;
    // this also opts them out of React's SSR auto-preload hints. Framework
    // icons rendered via `imgIcons()` intentionally stay eager (non-lazy).
    // Spread props last so individual MDX images can override, e.g.
    // above-the-fold images via `<img loading="eager" ...>`.
    img: (props) => (
      <ImageZoom
        loading="lazy"
        decoding="async"
        {...(props as any)}
      />
    ),
    ImageZoom,
    Accordion,
    Accordions,
    Tabs,
    Tab,
    Files,
    Folder,
    File,
    Steps,
    Step,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
