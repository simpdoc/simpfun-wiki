import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, ThemeConfig} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '简幻欢社区维基',
  tagline: 'Not Official, but still useful.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  //
  // `v4: true` turns on EVERY upcoming Docusaurus v4 breaking change at once:
  //   - siteStorageNamespacing        localStorage keys become `theme-<hash>`
  //                                   (resets existing visitor storage ONCE, by design)
  //   - fasterByDefault               Docusaurus Faster (Rspack + SWC + LightningCSS)
  //                                   + eager git VCS for showLastUpdateAuthor/Time
  //   - mdx1CompatDisabledByDefault   MDX v1 compat shims off, i.e. strict MDX v3:
  //                                   `:::note[Title]` and `## Heading {/* #id */}`
  //
  // NOTE: with a v4 future flag enabled, `@docusaurus/faster` MUST be a direct
  // dependency of this package. It is (pinned in package.json) — do not remove
  // it, or `npm run build` fails.
  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: 'https://next.simpdoc.top',
  // Site is served from the domain root.
  // If you ever move the build to a SUBPATH (e.g. https://simpdoc.top/wiki/),
  // this MUST be updated too, or every CSS/JS asset will 404.
  baseUrl: '/',

  // Only read by the `docusaurus deploy` command (GitHub Pages). Static builds
  // ignore them entirely, so they do not affect the simpdoc.top deployment.
  organizationName: 'simpdoc', // Usually your GitHub org/user name.
  projectName: 'simpfun-wiki', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        // The default docs instance is DISABLED on purpose.
        // This site has exactly three doc sets, all provided by the standalone
        // plugin instances below (docs-web / docs-mcje / docs-mcbe). Keeping the
        // preset's default instance would add a fourth, unrelated one.
        //
        // Safe to disable: the navbar logo links to the site root (`/`), not to
        // `/docs` — see theme-classic `Logo`: `useBaseUrl(logo?.href || '/')`.
        // Everything that used to point at `/docs/intro` now points at a real
        // product route (homepage, footer, navbar).
        docs: false,
        // Blog is off: this is a documentation wiki, and an empty blog plugin
        // only adds an unused `/blog` archive.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Image zoom (click to enlarge). Configured via `themeConfig.zoom` below —
    // this plugin reads its options from themeConfig, NOT from plugin options.
    'docusaurus-plugin-image-zoom',

    // Each product gets its OWN docs plugin instance: separate content dir,
    // separate route base, separate sidebar file with a unique sidebarId.
    // `id` must be set on every instance (the default one has no id).
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'web',
        path: 'docs-web',
        routeBasePath: 'web',
        sidebarPath: './sidebars-web.ts',
        editUrl: 'https://github.com/simpdoc/simpfun-wiki/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'mcje',
        path: 'docs-mcje',
        routeBasePath: 'mcje',
        sidebarPath: './sidebars-mcje.ts',
        editUrl: 'https://github.com/simpdoc/simpfun-wiki/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'mcbe',
        path: 'docs-mcbe',
        routeBasePath: 'mcbe',
        sidebarPath: './sidebars-mcbe.ts',
        editUrl: 'https://github.com/simpdoc/simpfun-wiki/tree/main/',
      },
    ],
  ],

  // Themes are plugins that also provide a swizzleable theme. The local search
  // plugin ships its own theme (SearchBar / SearchPage), so it MUST be declared
  // here rather than in `plugins`.
  //
  // It is a classic "classic" plugin: it takes a SINGLE tuple of options.
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        // This site has NO default docs instance (`docs: false`) — all three doc
        // sets come from standalone plugin instances at /web, /mcje, /mcbe.
        // The plugin defaults to ["docs"], which would index nothing at all.
        // Leading slashes are optional; the plugin strips them.
        docsRouteBasePath: ['web', 'mcje', 'mcbe'],

        // These are the on-disk source dirs. They are ONLY used to compute the
        // content hash when `hashed` is enabled — they do NOT decide what gets
        // indexed. What gets indexed is driven by `docsRouteBasePath` above.
        docsDir: ['docs-web', 'docs-mcje', 'docs-mcbe'],

        // There is no blog, so make sure it is not scanned.
        indexBlog: false,
        // Index the homepage too, so looking up the wiki itself returns a hit.
        indexPages: true,

        // MUST contain exactly "zh" (not the Docusaurus locale "zh-Hans").
        // The plugin gates its whole Chinese pipeline on `language.includes("zh")`
        // (see dist/server/server/utils/buildIndex.js, generate.js and
        // dist/client/client/utils/tokenize.js). Passing "zh-Hans" silently
        // disables Chinese word segmentation.
        //
        // "en" is included as well: the docs are full of English terms
        // (Paper / Fabric / server.properties / max-players …). With only "zh"
        // those words are stored verbatim with NO English stemmer, so "servers"
        // would not match "server". Adding "en" registers the English
        // trimmer/stemmer pipeline. With 2+ languages lunr's multiLanguage()
        // combines both pipelines, and the zh tokenizer (jieba) is still used
        // for mixed CJK+Latin text because the plugin overrides it explicitly.
        language: ['en', 'zh'],

        // Bust the browser-cached index whenever doc content changes.
        hashed: true,

        // The left navbar is already full (logo + 3 doc entries), so pin the
        // search bar to the right instead of relying on autodetection.
        searchBarPosition: 'right',

        // REQUIRED on this site. SearchBar calls:
        //   useActiveVersion(activePlugin?.pluginId ?? docsPluginIdForPreferredVersion)
        // On non-docs pages (e.g. the homepage) `activePlugin` is undefined, so it
        // falls back to this option — whose default is the plugin id "default".
        // Because this site runs `docs: false`, no docs plugin with id "default"
        // exists and the SSG pass crashes with:
        //   Docusaurus plugin global data not found for "docusaurus-plugin-content-docs" plugin with id "default"
        // Pointing it at a real instance fixes that. Any instance works; all three
        // have isLast=true, so none of them rewrites the search index URL.
        docsPluginIdForPreferredVersion: 'web',

        // Useful for a wiki that is mostly Chinese prose.
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,

        // Per-instance search: generates a SEPARATE index per path, so each doc
        // set can be searched in isolation (scope selector in the search bar /
        // on the /search page).
        //
        // `path` must NOT start with "/" — the plugin strips leading slashes and
        // compares against the route with the baseUrl already removed.
        searchContextByPaths: [
          {label: '官网使用指南', path: 'web'},
          {label: 'MCJE', path: 'mcje'},
          {label: 'MCBE', path: 'mcbe'},
        ],

        // REQUIRED alongside searchContextByPaths — do not remove.
        //
        // By default the plugin partitions HARD: a document matching a context is
        // `continue`d and thereby EXCLUDED from the root index
        // (postBuildFactory.js: `if (matchedPaths.length > 0 && !useAllContextsWithNoSearchContext) continue;`).
        // Our three contexts cover every doc path, so without this flag the root
        // index ends up EMPTY — and since the worker fetches exactly ONE index per
        // query (`searchIndexUrl.replace("{dir}", searchContext ? ... : "")`), the
        // homepage and the /search page would find NOTHING at all.
        //
        // With it enabled:
        //   • root index            -> every doc  ("search everywhere" still works)
        //   • the three contexts    -> their own doc set only
        //   • /search page gets an extra "Everywhere" scope option
        useAllContextsWithNoSearchContext: true,
      },
    ],
  ],

  // NOTE: this is intentionally `ThemeConfig` (not `satisfies Preset.ThemeConfig`).
  // Third-party plugins such as docusaurus-plugin-image-zoom read their options
  // from `themeConfig` but ship no type export, so an exact `satisfies` check
  // would reject the extra `zoom` key. The outer `Config` annotation still
  // validates everything else.
  themeConfig: {
    // Social card used for link previews (og:image / twitter:image).
    // This is still the Docusaurus-branded placeholder — replace it when you
    // have a real banner, and update this path.
    image: 'img/docusaurus-social-card.jpg',

    // Click-to-zoom for content images (medium-zoom under the hood).
    // Consumed by the `docusaurus-plugin-image-zoom` client module.
    zoom: {
      // Only zoom images inside doc/page content, so the navbar logo and
      // inline icons are not affected.
      selector: '.markdown img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
      config: {
        // medium-zoom options: https://github.com/francoischalifour/medium-zoom
        margin: 48,
      },
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '简幻欢社区维基',
      logo: {
        alt: '简幻欢社区维基',
        // Source is 322x323 (near-square), so a fixed height grows the width
        // proportionally. Without an explicit height the image would render at
        // its natural size and blow up the navbar.
        src: 'img/simpfun.png',
        height: 32,
        width: 'auto',
      },
      items: [
        // `docsPluginId` is MANDATORY on every product entry. Without it the
        // navbar item resolves against the default docs instance and all three
        // links point at the same sidebar.
        {
          type: 'docSidebar',
          docsPluginId: 'web',
          sidebarId: 'webSidebar',
          position: 'left',
          label: '官网使用指南',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'mcje',
          sidebarId: 'mcjeSidebar',
          position: 'left',
          label: 'MCJE 文档',
        },
        {
          type: 'docSidebar',
          docsPluginId: 'mcbe',
          sidebarId: 'mcbeSidebar',
          position: 'left',
          label: 'MCBE 文档',
        },
        {
          href: 'https://github.com/simpdoc/simpfun-wiki',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档列表',
          items: [
            {
              label: '官网使用指南',
              to: '/web/intro',
            },
            {
              label: 'MCJE 文档',
              to: '/mcje/intro',
            },
            {
              label: 'MCBE 文档',
              to: '/mcbe/intro',
            },
          ],
        },
        {
          title: '官方链接',
          items: [
            {
              label: '简幻欢官网',
              href: 'https://simpfun.cn/',
            },
            {
              label: '简幻云官网',
              href: 'https://v2.simpcloud.cn/',
            },
            {
              label: '简幻欢官方文档',
              href: 'https://www.yuque.com/simpfun/sfe/main',
            },
            {
              label: 'Bilibili 主页',
              href: 'https://space.bilibili.com/1493209225',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '简幻欢第三方镜像文档',
              href: 'https://doc.ideafox.top/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/simpdoc/simpfun-wiki',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 简幻欢社区维基. Built with Docusaurus.<br /><a class="footer__link-item" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">黑ICP备2024025211号-2</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'java',
        'python',
        'bash',
        'json',
        'powershell',
        'properties',
        'yaml',
        'log',
      ]
    },
  } as ThemeConfig,
};

export default config;
