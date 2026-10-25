# 开发与构建文档

本文件面向需要**修改站点本身**的人：改配置、调样式、动构建或部署。

> 只是想补充或修正文档内容？请看 [贡献指南](CONTRIBUTING.md)。返回 [项目首页](README.md)。

## 目录

- [环境要求](#环境要求)
- [常用命令](#常用命令)
- [目录结构](#目录结构)
- [技术栈](#技术栈)
- [内容管线](#内容管线)
- [路由一览](#路由一览)
- [新增一套文档](#新增一套文档)
- [搜索](#搜索)
- [Markdown 与 LLM 视图](#markdown-与-llm-视图)
- [部署](#部署)
- [常见问题排查](#常见问题排查)

---

## 环境要求

| 项目 | 要求 |
| --- | --- |
| Node.js | **20.9 或更高**（Next.js 16 的最低要求，推荐使用 LTS 版本） |
| 包管理器 | **pnpm**（本仓库用 `pnpm-lock.yaml` 锁定依赖，请勿混用 npm/yarn） |

pnpm v10+ 默认拦截依赖的安装脚本。本仓库已在 `pnpm-workspace.yaml` 的 `allowBuilds` 中放行 `esbuild` 与 `unrs-resolver`：

```yaml
allowBuilds:
  esbuild: true
  unrs-resolver: true
```

如果将来新增了带安装脚本的依赖，需要在这里补充白名单，否则 `pnpm install` 时会看到脚本被跳过的警告。

## 常用命令

```bash
pnpm install       # 安装依赖
pnpm dev           # 本地开发服务器（http://localhost:3000）
pnpm build         # 生产构建：静态导出，产物输出到 out/
pnpm start         # 用 serve 预览 out/ 产物（先 build）
pnpm types:check   # next typegen 生成路由类型 + tsc --noEmit 类型检查
pnpm lint          # ESLint 检查
```

> `pnpm types:check` 里的 `next typegen` 不能省：代码中的 `LayoutProps<'/docs'>`、`PageProps<...>` 等类型是 Next.js 按路由自动生成的，跳过它会报大量「找不到类型」。

## 目录结构

```
.
├── content/docs/               # 全部文档内容（.mdx）
│   ├── meta.json               # 根 meta：列出三套文档
│   ├── web/                    # 官网使用指南  → /docs/web
│   ├── mcje/                   # MCJE 文档     → /docs/mcje
│   └── mcbe/                   # MCBE 文档     → /docs/mcbe
├── public/img/                 # 静态资源（favicon、文档截图）
├── src/
│   ├── app/
│   │   ├── (home)/             # 落地页（page.tsx 含文档卡片、页脚）
│   │   ├── docs/               # 文档布局、选择文档页、[...slug] 文档页
│   │   ├── api/search/         # 全文搜索索引（构建时生成静态文件）
│   │   ├── llms.txt/           # LLM 索引文件
│   │   ├── llms-full.txt/      # 全站 Markdown 合集
│   │   ├── llms.mdx/           # 每页 Markdown 视图（/llms.mdx/docs/...）
│   │   └── og/                 # 每页社交分享图（OG Image）
│   ├── components/             # mdx 组件、搜索弹窗、ViewOptions 等
│   ├── lib/
│   │   ├── source.ts           # 内容源定义（defineDocs + loader）
│   │   ├── shared.ts           # 站点常量：站名、路由前缀、GitHub 配置
│   │   └── layout.shared.tsx   # 布局共享配置：导航标题、翻译、GitHub 链接
│   └── proxy.ts                # 请求代理（Markdown 内容协商，见下文）
├── .source/                    # fumadocs-mdx 自动生成，勿改、勿提交
├── source.config.ts            # fumadocs-mdx 配置
├── next.config.mjs             # Next.js 配置（静态导出）
├── edgeone.json                # EdgeOne Pages 部署配置
└── pnpm-workspace.yaml         # pnpm 配置（依赖构建脚本白名单）
```

## 技术栈

| 依赖 | 说明 |
| --- | --- |
| [Next.js](https://nextjs.org) 16 | App Router；`output: 'export'` 整站静态导出，产物在 `out/` |
| [Fumadocs](https://fumadocs.dev) | 文档框架，由三部分组成，见下 |
| React 19 | — |
| Tailwind CSS v4 | 通过 `@tailwindcss/postcss` 接入 |
| TypeScript | 严格模式；站点 UI 文案为中文 |

Fumadocs 的三个包各司其职：

- **`fumadocs-core`**：无头部分——内容源 `loader()`、页面树、搜索
- **`fumadocs-mdx`**：MDX 编译管线，编译 `content/` 并生成 `.source/` 类型与数据
- **`fumadocs-ui`**：UI 主题组件（本仓库实际安装的是 `@fumadocs/base-ui`，`package.json` 中以 `npm:` 别名映射为 `fumadocs-ui`）

> **为什么是静态导出**：文档站点不需要服务端逻辑，静态导出后可以部署到任何静态托管平台（本站用 EdgeOne Pages），代价是一些服务端特性不可用（见[部署](#部署)）。

## 内容管线

1. **`source.config.ts`**：fumadocs-mdx 的编译配置。当前只做了一件事——`remarkImageOptions.useImport: false`，让 Markdown 图片可以直接用路径引用（如 `![x](/img/pages/a.png)`），不必写 import
2. **`src/lib/source.ts`**：用 `defineDocs()` 声明内容目录为 `content/docs`，页面 schema 用 `pageSchema`、meta 用 `metaSchema`；`postprocess.includeProcessedMarkdown: true` 让每页的 Markdown 纯文本被保留，供 `/llms.mdx` 视图使用；最后 `loader()` 导出 `source`，同时用 `llms()` 生成 `docsLlms`
3. **`.source/`**：`pnpm dev` / `pnpm build` 时由 fumadocs-mdx 自动生成，已被 `.gitignore` 忽略。**不要手改、不要提交**；报奇怪的编译错误时可以整个删掉重新生成

新增/修改文档页面不需要动以上任何文件，流程见 [贡献指南](CONTRIBUTING.md#四新增页面)。

## 路由一览

| 路由 | 源文件 | 说明 |
| --- | --- | --- |
| `/` | `src/app/(home)/page.tsx` | 落地页：三张文档卡片、特性介绍、页脚 |
| `/docs` | `src/app/docs/page.tsx` | 「选择文档」页 |
| `/docs/<slug>` | `src/app/docs/[...slug]/page.tsx` | 文档页：TOC、Markdown 复制按钮、「打开」菜单（GitHub / Markdown）、OG 图 |
| `/api/search` | `src/app/api/search/route.ts` | 搜索索引（`staticGET`，构建时生成静态文件） |
| `/llms.txt`、`/llms-full.txt` | `src/app/llms*.txt/route.ts` | LLM 索引 / 全站 Markdown |
| `/llms.mdx/docs/<路径>/content.md` | `src/app/llms.mdx/` | 每篇文档的 Markdown 视图 |
| `/og/docs/<路径>/image.png` | `src/app/og/docs/[...slug]/route.tsx` | 分享图，`generateMetadata` 自动引用 |

站点常量集中在 **`src/lib/shared.ts`**：`appName`（站名）、`docsRoute`（文档前缀 `/docs`）、`gitConfig`（GitHub 仓库与分支）。改这些值会影响全站链接与「在 GitHub 中打开」的目标，改前想清楚。

导航栏标题与 GitHub 链接在 `src/lib/layout.shared.tsx`；全局翻译已用 `@fumadocs/language/zh-cn` 预设。

## 新增一套文档

以新增一套「MCEE」文档为例，需要同时改 **5 处**：

1. **新建内容目录** `content/docs/mcee/`，放入至少一个 `intro.mdx` 和一份 `meta.json`（`"root": true`）
2. **加入根 meta**：把 `"mcee"` 加进 `content/docs/meta.json` 的 `pages`
3. **落地页** `src/app/(home)/page.tsx`：在 `docEntries` 中追加一项（首页卡片与页脚都会引用它）
4. **顶部导航** `src/app/(home)/layout.tsx`：在 `links` 中追加入口
5. **选择文档页** `src/app/docs/page.tsx`：在 `entries` 中追加一项

不需要改文档布局或侧边栏——`src/app/docs/layout.tsx` 直接读取 `source.getPageTree()`，新文档会自动出现在侧边栏中。改完请务必本地跑一次 `pnpm build` 确认通过。

## 搜索

搜索是**纯静态**的，无任何后端依赖：

- `src/app/api/search/route.ts` 用 `createFromSource(source)` 的 `staticGET` 在构建时把索引生成为静态文件，前端经 `useStaticSearch` 读取
- 搜索弹窗是自定义组件 `src/components/search.tsx`，在 `src/components/provider.tsx` 中挂载；想改搜索 UI 改它即可
- 索引内容完全跟随文档变化，不需要手动维护

## Markdown 与 LLM 视图

- `/llms.txt`（索引）与 `/llms-full.txt`（全量）由 `src/lib/source.ts` 中的 `docsLlms` 生成
- 单页 Markdown 由 `src/app/llms.mdx/docs/[[...slug]]/route.ts` 在构建时静态生成，地址为 `/llms.mdx/docs/<路径>/content.md`（如 `/llms.mdx/docs/mcje/content.md`）

> `edgeone.json` 里为 `/llms.mdx/*` 配置了 `Content-Type: text/markdown; charset=utf-8` 响应头，让 Markdown 视图以正确的类型返回。静态导出后这些路由会变成 `out/` 下的静态文件，托管平台需要支持这类 header 配置。

## 部署

### 构建产物

`next.config.mjs` 设置了 `output: 'export'`，`pnpm build` 会把**纯静态站点**输出到 `out/`：

- 不能使用依赖服务端的特性：ISR、按请求渲染的 Route Handler、Next.js 图片优化服务（因此 `images.unoptimized: true`）
- 所有「动态」路由（搜索索引、OG 图、llms 文件）实际都是构建时生成、随 `out/` 一起发布的静态文件

### 部署平台

本站通过 **EdgeOne Pages** 部署，配置在 `edgeone.json`：

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "headers": [ { "source": "/llms.mdx/*", ... } ]
}
```

若更换托管平台，只需保证：能执行 `pnpm install && pnpm build`、以 `out/` 为站点根发布、并能给 `/llms.mdx/*` 设置上述 `Content-Type`。

### 上线前检查清单

- [ ] `pnpm lint` 通过
- [ ] `pnpm types:check` 通过
- [ ] `pnpm build` 通过
- [ ] `pnpm start` 后抽查 `/`、`/docs/web`、`/docs/mcje`、`/docs/mcbe` 均正常
- [ ] 抽查搜索可用，抽查任一文档页的 `.md` 视图与分享图正常
- [ ] 新增图片已放入 `public/img/` 且路径以 `/` 开头

## 常见问题排查

### `pnpm install` 提示安装脚本被忽略

pnpm v10+ 默认拦截依赖安装脚本。本仓库已放行 `esbuild`、`unrs-resolver`（见[环境要求](#环境要求)）。若新依赖需要构建脚本，把包名加进 `pnpm-workspace.yaml` 的 `allowBuilds`。

### 类型检查报 `LayoutProps` / `PageProps` 不存在

这些类型由 `next typegen` 按路由生成。直接运行 `tsc` 会报错，**请使用 `pnpm types:check`**（脚本内已包含 `next typegen`）。

### fumadocs-mdx 编译报错，`.source` 行为异常

`.source/` 是生成物，偶尔会与内容不一致。整个删掉 `node_modules` 之外的 `.source/` 目录，重新 `pnpm dev` 或 `pnpm build` 即可重建。

### dev 正常、`pnpm build` 失败

大概率是引入了静态导出不支持的特性（见[部署](#部署)）：在组件里用了 `cookies()`/`headers()` 等服务端 API、Route Handler 未导出 `generateStaticParams` 等。报错信息通常会指向具体页面。

### 图片在本地能看到、部署后 404

检查引用路径是否以 `/` 开头并确实位于 `public/` 下。静态导出不会改写相对路径，`./img/...` 这类相对引用会指向错误的地址。

### 改了 `src/lib/shared.ts` 之后站内链接错乱

`docsRoute`、`docsContentRoute` 等常量被搜索、Markdown 视图、`proxy.ts` 多处引用，属于「牵一发而动全身」的配置。修改后请全站自查（`pnpm build` + `pnpm start` 抽查），不要只看首页。

---

## 参考文档

- [Fumadocs 官方文档](https://www.fumadocs.dev/docs) —— 页面约定、`meta.json` 语法、MDX 组件
- [Next.js 文档](https://nextjs.org/docs) —— App Router、静态导出
- [Tailwind CSS v4](https://tailwindcss.com/docs) —— 样式系统
