# 贡献指南

感谢你愿意为简幻欢社区维基出一份力！

本指南面向**所有贡献者**。你不需要会写代码——补充文档、修正错别字、报错，都是有价值的贡献。

> 只想改站点配置、构建或部署？请看 [开发与构建文档](DEVELOPMENT.md)。

## 我可以怎么贡献

| 方式 | 适合谁 | 入口 |
| --- | --- | --- |
| 修正错别字、补充说明 | 任何人 | 文档页「打开」→「在 GitHub 中打开」 |
| 新增一篇文档 | 熟悉对应平台的玩家 | 见[新增页面](#四新增页面) |
| 报错 / 提需求 | 任何人 | [新建 Issue](https://github.com/simpdoc/simpfun-wiki/issues/new/choose) |
| 改站点样式、配置 | 会前端 | [开发文档](DEVELOPMENT.md) |

**最快的方式**：打开任意文档页面，点击标题下方的 **「打开」→「在 GitHub 中打开」**。
GitHub 会直接打开对应的源文件，改完在网页上提交即可，**全程不需要本地环境**。

### 通过 Issue 反馈

不想自己动手改，或想先讨论清楚，请[新建 Issue](https://github.com/simpdoc/simpfun-wiki/issues/new/choose)，
说明「哪篇文档、哪里有问题、建议怎么改」。只是提问或聊想法的话，去[讨论区](https://github.com/simpdoc/simpfun-wiki/discussions)更随意。

---

## 一、改文档

三套文档各在独立目录下，路由与目录一一对应：

| 文档 | 目录 | 路由 |
| --- | --- | --- |
| 官网使用指南 | `content/docs/web/` | `/docs/web/...` |
| MCJE | `content/docs/mcje/` | `/docs/mcje/...` |
| MCBE | `content/docs/mcbe/` | `/docs/mcbe/...` |

例如路由 `/docs/web/create_server` 对应源文件 `content/docs/web/create_server.mdx`。

> **文件名就是 URL**：`custom_image/addownjava.mdx` → `/docs/web/custom_image/addownjava`。
> 子目录会出现在 URL 中（如 `common_operations/op.mdx` → `/docs/mcje/common_operations/op`）。
> 文件名一旦确定就不要再改——**改名等于改公开 URL**，会让已有外链失效。

文件是 Markdown（`.mdx`）格式，直接编辑即可。推荐用文档页的「打开 → 在 GitHub 中打开」来定位文件；
在 GitHub 网页上提交会自动创建分支并引导你发起 Pull Request。

---

## 二、文档写作规范

所有页面都是 MDX。以下是本站的写作约定：

### 页面开头写 front matter

```mdx
---
title: "修改天气"
description: "可选的一两句摘要，会显示在标题下方"
---

## 暂停时间

正文……
```

- `title` **必填**，它是页面的标题，也会用于侧边栏、搜索结果与分享图
- `description` 可选
- **正文里不要再写一级标题（`#`）**，从 `##` 开始写；更多可选字段见 [Fumadocs 官方文档](https://www.fumadocs.dev/docs/page-conventions)

### 提示框用 `<Callout>`

```mdx
<Callout type="warn" title="注意">

模组与插件分属不同生态，不能混用。

</Callout>
```

- `type` 可选值：`info`（默认）、`warn`、`error`、`success`、`idea`
- `title` 写在属性里，如上例
- **无需 import**，直接写即可

### 折叠块用 `<Accordions>`

适合放邀请码列表、FAQ、可选的长内容：

```mdx
<Accordions>
  <Accordion title="开发者邀请码列表（点击展开）">

  被折叠的内容，Markdown 完全生效。

  </Accordion>
</Accordions>
```

同样**无需 import**。单个条目用 `<Accordion>`，外层必须包 `<Accordions>`。

### 代码块

标注语言，可加 `title` 显示文件名：

````mdx
```properties title="server.properties"
max-players=20
```
````

行内代码用反引号，如 `server.properties`。

### 图片

图片放在 `public/img/pages/<平台>/`（如 `public/img/pages/mcje/`），可被多篇文档复用的放 `public/img/pages/`。

**引用时路径必须以 `/` 开头**——`/img/...` 指向 `public/img/...`：

```mdx
{/* ✅ 正确 */}
![服务器控制台界面](/img/pages/ins-console-2.webp)

{/* ❌ 错误：相对路径找不到文件 */}
![服务器控制台界面](img/pages/ins-console-2.webp)
```

alt 文本请写**有意义的描述**，不要只写数字：它会在图片加载失败时显示，也影响无障碍阅读与搜索收录。
图片已全站启用点击放大，无需额外处理；需要控制宽度可用 HTML：`<img src="/img/pages/..." width="50%" />`。

### 站内链接

用**以 `/docs/` 开头的绝对路径**，跨文档互链要带目标文档前缀：

```mdx
[创建服务器](/docs/web/create_server)
[常用操作：给予 OP](/docs/mcje/common_operations/op)
```

### 其他约定

- 文件名**全小写**，单词用**下划线**分隔（本仓库现状），如 `select_server.mdx`
- 统一用 `.mdx` 扩展名（即使不含 JSX）
- 中文与英文、数字之间加半角空格，如「使用 Paper 核心」
- 想给标题加自定义锚点：`## 常见问题 [#faq]`，然后 `链接到常见问题](#faq)`
- 表格、任务列表等 GFM 语法可直接使用；遇到 MDX 编译报错时，优先检查是否把 `<` `>` 当普通字符使用（需用反引号包成代码或写成 `&lt;`）

---

## 三、目录与侧边栏（meta.json）

本站侧边栏**不按文件名排序**，而是由每个目录下的 `meta.json` 决定：

| 文件 | 作用 |
| --- | --- |
| `content/docs/meta.json` | 根入口，列出三套文档 |
| `content/docs/<文档>/meta.json` | 每套文档的根目录，带 `"root": true`，列出各页面 |
| `content/docs/<文档>/<子目录>/meta.json` | 子目录的标题与页面顺序 |

以 MCJE 常用操作为例：

```json
{
  "title": "Java 版常用操作",
  "pages": [
    "op",
    "keepinventory",
    "enable_commandblock"
  ]
}
```

三条关键规则：

1. **`pages` 数组的顺序就是侧边栏顺序**，想调整位置就改数组
2. **`pages` 一旦写明，未列出的文件不会出现在侧边栏**——所以新增页面后**必须**把它加进所在目录的 `meta.json`，否则读者无法从侧边栏找到它
3. `title` 是侧边栏里显示的目录名，与文件内容无关

---

## 四、新增页面

以在 MCJE 常用操作中新增一篇「修改天气」为例：

1. 新建 `content/docs/mcje/common_operations/weather.mdx`：

   ```mdx
   ---
   title: "修改天气"
   ---

   ## 暂停时间

   正文……
   ```

2. 在 `content/docs/mcje/common_operations/meta.json` 的 `pages` 中加入 `"weather"`（放到你想要的位置）：

   ```json
   {
     "title": "Java 版常用操作",
     "pages": [
       "op",
       "keepinventory",
       "weather",
       "enable_commandblock"
     ]
   }
   ```

3. 本地预览确认（见[本地预览](#五本地预览与自检)），或在 PR 中等待检查
4. 提交 PR

> **别忘了第 2 步**。这是本站新增页面最容易遗漏的一步——没加 `meta.json`，页面本身能通过 URL 访问，但侧边栏里不会出现。

---

## 五、本地预览与自检

**只改文档的话这一步可以跳过**——PR 提交后会有检查。但本地预览能立刻看到排版效果。

```bash
pnpm install        # 首次需要，环境要求见开发文档
pnpm dev            # 打开 http://localhost:3000
pnpm build          # 提交前建议跑一次
```

更完整的环境说明与常见报错处理见 [开发与构建文档](DEVELOPMENT.md)。

---

## 六、提交 PR

1. Fork 本仓库（或直接在网页上编辑以自动派生分支）
2. 新建分支，建议命名 `docs/简短描述`，如 `docs/mcje-memory-tuning`
3. 提交信息建议用 [Conventional Commits](https://www.conventionalcommits.org/) 风格：
   - `docs(mcje): 补充内存分配建议`
   - `docs(web): 修正变配步骤的描述`
   - `fix(theme): 修正深色模式下的样式`
4. 发起 Pull Request，说明**改了什么、为什么改**
5. 等待维护者 review

几天没有动静的话，欢迎在 PR 里 @ 维护者，或到[讨论区](https://github.com/simpdoc/simpfun-wiki/discussions)提醒。

### 内容要求

- **准确优先**：请确保操作步骤是你实际验证过的
- **不要复制粘贴他人文档**：注意版权，引用请注明来源
- **截图请打码**：上传前清理掉 Token、IP、账号等敏感信息
- **保持中立**：客观描述，避免夸大宣传

---

## 七、许可证

**你提交到本站的文档内容，默认按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 协议发布。** 提交 PR 或直接在网页上编辑提交，即表示你同意以该协议授权你的贡献。

这意味着任何人都可以自由复制、转载、改编本站文档，但必须：

- **署名**：注明内容来自简幻欢社区维基，并附上原页面链接
- **非商用**：不得用于商业目的
- **相同方式共享**：改编后的作品必须以同一协议发布

> 站点代码（`src/`、配置文件等）采用 [MIT License](https://opensource.org/licenses/MIT)，与文档协议不同，改代码请以 MIT 协议为准。

由其他来源引入的内容仍适用其**来源处的协议**，请在文中注明来源与协议，不要直接搬运未获授权的内容。

---

## 八、常见问题

**Q：我不会用 Git，能贡献吗？**

可以。在文档页点「打开 → 在 GitHub 中打开」，改完直接提交，GitHub 会自动创建分支和 PR，全程不需要命令行。

**Q：新增的页面在侧边栏里不出现？**

大概率是忘了把它加进**所在目录的 `meta.json`** 的 `pages` 数组。见[目录与侧边栏](#三目录与侧边栏metajson)。

**Q：改了之后页面没变化？**

本地开发服务器一般会热更新。没反应的话，检查文件是否放在了**正确的文档目录**下（比如把 MCBE 的内容放进了 `content/docs/mcje/`）。

**Q：构建报 MDX 编译错误？**

大概率是 MDX 语法问题：`<` `>` 没转义、组件属性用了 `class` 而不是 `title`、`<Accordion>` 没包 `<Accordions>` 等。回到[文档写作规范](#二文档写作规范)对照检查。

**Q：图片显示不出来？**

引用路径必须以 `/` 开头并放在 `public/img/` 下。见[图片](#图片)。

**Q：我想改首页、导航栏或样式？**

那属于站点开发，请看 [开发与构建文档](DEVELOPMENT.md)，主要文件是 `src/app/(home)/page.tsx` 与 `src/lib/layout.shared.tsx`。

---

再次感谢你的贡献！🎉
