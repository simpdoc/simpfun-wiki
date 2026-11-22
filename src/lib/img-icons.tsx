import type { ReactNode } from 'react';
import type { LoaderPlugin } from 'fumadocs-core/source';

/**
 * Render `icon` strings in meta files (e.g. `/img/logo.webp`) as `<img>` elements.
 *
 * Icon containers in the sidebar only size SVG descendants (`[&_svg]:size-4`),
 * so the image must carry its own fixed size to match text height. Tab boxes
 * restore full-size rendering via the `tabs.transform` wrapper in docs layout.
 *
 * `loading="lazy"` opts out of React's automatic image preload. Tab icons for
 * inactive sections are part of the tab-switcher props but are only mounted once
 * the switcher is opened, so an eager preload would fetch an image the initial
 * page never paints (Chrome: "preloaded but not used within a few seconds").
 */
export function imgIcons(): LoaderPlugin {
  const replace = (icon: ReactNode): ReactNode =>
    typeof icon === 'string' ? (
      <img
        src={icon}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-4 shrink-0 object-contain"
      />
    ) : (
      icon
    );

  return {
    name: 'simpfun:img-icons',
    transformPageTree: {
      file: (node) => {
        node.icon = replace(node.icon);
        return node;
      },
      folder: (node) => {
        node.icon = replace(node.icon);
        return node;
      },
      separator: (node) => {
        node.icon = replace(node.icon);
        return node;
      },
    },
  };
}
