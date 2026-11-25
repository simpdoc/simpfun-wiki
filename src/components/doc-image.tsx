'use client';

import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { useState } from 'react';
import type { ImageProps } from 'fumadocs-core/framework';

/**
 * Document content image with a shimmer placeholder.
 *
 * Content images load lazily (`loading="lazy"`) and sit far down most pages,
 * so a subtle shimmer makes the loading state visible instead of looking like
 * a broken image. The `fd-doc-img-loaded` class (toggled on `onLoad`) stops
 * the animation once pixels are on screen, which also covers transparent
 * images. Framework icons outside MDX do not use this component and stay
 * eager, per project policy.
 */
export function DocImage({ className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <ImageZoom
      loading="lazy"
      decoding="async"
      className={`fd-doc-img${loaded ? ' fd-doc-img-loaded' : ''}${className ? ` ${className}` : ''}`}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  );
}
