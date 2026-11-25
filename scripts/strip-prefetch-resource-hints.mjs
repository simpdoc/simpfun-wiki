#!/usr/bin/env node
/**
 * Strip React resource hints (`:HL[...]` flight rows) from statically
 * exported prefetch payloads under `out/`.
 *
 * The client router processes `:HL` hints the moment a prefetched payload
 * arrives — while the user is still on the *current* page. Any hinted css
 * chunk or image that the current page doesn't render gets preloaded and
 * then flagged by Chrome: "The resource ... was preloaded using link preload
 * but not used within a few seconds". Stripping the hints removes those
 * warnings without changing behavior: on real navigation the resources are
 * referenced by the payload's rendered elements (stylesheets/images) and
 * load as usual.
 *
 * Full-render payloads (`__next.*._full.txt`) are fetched right before an
 * actual navigation, so their hints are consumed immediately and are kept.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const outDir = join(process.cwd(), 'out');
let cleanedFiles = 0;
let removedLines = 0;

function isPrefetchPayload(path, basename) {
  if (!basename.endsWith('.txt')) return false;
  if (basename.includes('._full.')) return false; // used for real navigations
  if (basename.startsWith('__next')) return true;
  return relative(outDir, path).split(/[\\/]/).some((part) => part.startsWith('__next'));
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path);
    } else if (entry.isFile() && isPrefetchPayload(path, entry.name)) {
      const before = readFileSync(path, 'utf8');
      const lines = before.split(/\r?\n/);
      const kept = lines.filter((line) => !line.startsWith(':HL['));
      if (kept.length !== lines.length) {
        writeFileSync(path, kept.join('\n'));
        cleanedFiles += 1;
        removedLines += lines.length - kept.length;
      }
    }
  }
}

walk(outDir);
console.log(
  `[strip-prefetch-hints] removed ${removedLines} resource hint(s) from ${cleanedFiles} prefetch payload(s)`,
);
