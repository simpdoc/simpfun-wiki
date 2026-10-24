import type { ReactNode } from 'react';
import type { LoaderPlugin } from 'fumadocs-core/source';

/**
 * Render `icon` strings in meta files (e.g. `/img/logo.png`) as `<img>` elements.
 *
 * Icon containers in the sidebar only size SVG descendants (`[&_svg]:size-4`),
 * so the image must carry its own fixed size to match text height. Tab boxes
 * restore full-size rendering via the `tabs.transform` wrapper in docs layout.
 */
export function imgIcons(): LoaderPlugin {
  const replace = (icon: ReactNode): ReactNode =>
    typeof icon === 'string' ? (
      <img src={icon} alt="" className="size-4 shrink-0 object-contain" />
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
