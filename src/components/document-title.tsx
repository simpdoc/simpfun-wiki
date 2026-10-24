'use client';

import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function DocumentTitle({ title }: { title: string }) {
  useIsomorphicLayoutEffect(() => {
    if (document.title !== title) document.title = title;
  }, [title]);

  return null;
}
