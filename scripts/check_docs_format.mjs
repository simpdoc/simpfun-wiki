#!/usr/bin/env node
/**
 * 文档格式检查脚本（零依赖）
 *
 * 规则来源：.trellis/spec/docs/contributing.md（以及 docs/index.md 的 Pre-Development Checklist）
 * 用法：
 *   node scripts/check_docs_format.mjs                 # CI 模式：检查与 origin/main 的 merge-base 相比变更的文件
 *   node scripts/check_docs_format.mjs --base origin/xxx  # 指定对比基准
 *   node scripts/check_docs_format.mjs --all           # 扫描全库（本地体检用）
 *   node scripts/check_docs_format.mjs --files a.mdx b.mdx  # 直接检查指定文件（本地调试用）
 *
 * 退出码：
 *   默认非阻断模式（对应"仅评论警告不阻断"决策）：始终退出 0，违规以 GitHub 注解 + Job Summary 呈现。
 *   设置环境变量 STRICT=1 或传 --strict 时：存在 error 级违规则退出 1，可随时切换为阻断门禁。
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const DOCS = "content/docs";
const args = process.argv.slice(2);

const strictFlag = args.includes("--strict") || process.env.STRICT === "1";
let base = null;
const baseIdx = args.indexOf("--base");
if (baseIdx !== -1 && args[baseIdx + 1]) base = args[baseIdx + 1];
const scanAll = args.includes("--all");

// --files a.mdx b.mdx：直接检查指定文件（本地调试用，不走 git diff）
const filesIdx = args.indexOf("--files");
const directFiles =
  filesIdx !== -1
    ? args
        .slice(filesIdx + 1)
        .filter((p) => !p.startsWith("--"))
        .map((p) => ({ status: "A", path: relative(ROOT, resolve(ROOT, p)).replaceAll("\\", "/") }))
    : null;

// ---------------------------------------------------------------------------
// 收集待检查文件
// ---------------------------------------------------------------------------

function gitDiffChanged(baseRef) {
  // 以 merge-base 为准，兼容 PR 分支落后/分叉的情况
  const mergeBase = execSync(`git merge-base HEAD ${baseRef}`, {
    encoding: "utf8",
  }).trim();
  const out = execSync(
    `git diff --name-status --diff-filter=ACMR ${mergeBase}..HEAD`,
    { encoding: "utf8", maxBuffer: 1024 * 1024 * 16 },
  );
  const changed = [];
  for (const line of out.split("\n")) {
    if (!line.trim()) continue;
    const [status, ...pathParts] = line.split("\t");
    changed.push({ status: status.trim(), path: pathParts.join("\t") });
  }
  return changed;
}

function listAllDocs() {
  const out = execSync(`git ls-files "${DOCS}"`, { encoding: "utf8" });
  return out
    .split("\n")
    .filter(Boolean)
    .map((p) => ({ status: "A", path: p }));
}

let files;
if (directFiles) {
  files = directFiles;
} else if (scanAll) {
  files = listAllDocs();
} else {
  const baseRef = base ?? "origin/main";
  // CI 中 checkout@v4(fetch-depth:0) 已拉全历史；本地需先 fetch
  files = gitDiffChanged(baseRef);
}

const mdxFiles = files.filter((f) => f.path.endsWith(".mdx"));
const metaFiles = files.filter((f) => f.path.endsWith("meta.json"));

// ---------------------------------------------------------------------------
// 违规收集与输出
// ---------------------------------------------------------------------------

/** @type {{level: 'error'|'warning', file: string, line: number, rule: string, message: string}[]} */
const issues = [];
function report(level, file, line, rule, message) {
  issues.push({
    level,
    file: file.replaceAll("\\", "/"),
    line,
    rule,
    message,
  });
}

// ---------------------------------------------------------------------------
// 通用解析工具
// ---------------------------------------------------------------------------

function parseFrontMatter(content) {
  const lines = content.split("\n");
  if (lines[0]?.trim() !== "---") return { meta: null, bodyStartLine: 1 };
  let close = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      close = i;
      break;
    }
  }
  if (close === -1) return { meta: null, bodyStartLine: 1 };
  const meta = {};
  for (let i = 1; i < close; i++) {
    const m = lines[i].match(/^([A-Za-z_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[m[1]] = value;
  }
  return { meta, bodyStartLine: close + 1 };
}

function readMetaJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return undefined; // JSON 解析失败
  }
}

// ---------------------------------------------------------------------------
// 单个 .mdx 文件检查
// ---------------------------------------------------------------------------

function checkMdx(relPath, status) {
  const abs = resolve(ROOT, relPath);
  // 统一归一化为 LF，避免 CRLF 的 \r 干扰行解析与正则
  const content = readFileSync(abs, "utf8").replace(/\r\n/g, "\n");
  const lines = content.split("\n");
  const { meta, bodyStartLine } = parseFrontMatter(content);

  // R1 front matter
  if (!meta) {
    report("error", relPath, 1, "R1", "缺少 front matter（须以 --- 包裹并至少提供 title）");
  } else {
    if (!meta.title) report("error", relPath, 1, "R1", 'front matter 缺少必填的 "title"');
    else if (!meta.description)
      report("warning", relPath, 1, "R1", 'front matter 建议补充 "description"（用于摘要、搜索与分享）');
  }

  // R11 文件与目录命名（仅针对 docs 目录内文件）
  if (relPath.startsWith(DOCS + "/")) {
    const segs = relPath.slice(DOCS.length + 1).split("/");
    const fileSeg = segs.pop();
    if (!/^[a-z0-9_]+\.mdx$/.test(fileSeg))
      report("error", relPath, 1, "R11", `文件名 "${fileSeg}" 不符合小写+下划线规范`);
    for (const dir of segs) {
      if (!/^[a-z0-9_]+$/.test(dir))
        report("error", relPath, 1, "R11", `目录名 "${dir}" 不符合小写+下划线规范`);
    }
  }

  // 逐行扫描正文
  let inFence = false;
  let fenceMark = "";
  let prevHeadingLevel = 0;
  const JSX_OPEN_RE = /^\s*<(Callout|Accordion)\b[^>]*>\s*$/;
  const JSX_CLOSE_RE = /^\s*<\/(Callout|Accordion)>\s*$/;

  for (let i = bodyStartLine; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;
    const prevLine = lines[i - 1] ?? "";
    const nextLine = lines[i + 1] ?? "";

    // 代码围栏状态（R4 语言标注）
    const fence = line.match(/^\s*(```+|~~~+)\s*(.*)$/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceMark = fence[1][0]; // 记录围栏字符，用于配对
        const rest = fence[2].trim();
        if (!rest)
          report("error", relPath, lineNo, "R4", "代码块未标注语言（例如 ```properties）");
      } else if (fence[1][0] === fenceMark) {
        inFence = false;
        fenceMark = "";
      }
      continue;
    }
    if (inFence) continue; // 围栏内的 # 不是标题

    // R2 一级标题
    const heading = line.match(/^(#{1,6})\s+/);
    if (heading) {
      const level = heading[1].length;
      if (level === 1)
        report("error", relPath, lineNo, "R2", "正文不得出现一级标题，页面标题由 front matter 渲染");
      // R3 跳级
      if (prevHeadingLevel && level > prevHeadingLevel + 1)
        report(
          "error",
          relPath,
          lineNo,
          "R3",
          `标题层级跳级：h${prevHeadingLevel} 直接跳到 h${level}`,
        );
      prevHeadingLevel = level;
    }

    // R5 手写 MDX 组件 import
    if (/^\s*import\b/.test(line) && /\b(Callout|Accordions?|Tabs?|Tab|Files?|Folder|File)\b/.test(line))
      report("error", relPath, lineNo, "R5", "MDX 组件已全局注册，正文不要手写 import");

    // R6 Callout/Accordion 标签与正文之间的空行
    if (JSX_OPEN_RE.test(line) && nextLine.trim() && !/^\s*</.test(nextLine))
      report(
        "warning",
        relPath,
        lineNo,
        "R6",
        "标签与正文之间应保留空行，避免 MDX 误判 JSX 子表达式",
      );
    if (JSX_CLOSE_RE.test(line) && prevLine.trim() && !/^\s*</.test(prevLine))
      report("warning", relPath, lineNo, "R6", "正文与闭合标签之间应保留空行");
  }

  // R7/R8 用全文匹配再换算行号（跨行正则更稳）
  for (const m of content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) {
    const alt = m[1].trim();
    const src = m[2];
    const lineNo = content.slice(0, m.index).split("\n").length;
    if (!alt || /^图片\s*\d+$/.test(alt))
      report("error", relPath, lineNo, "R7", `图片 alt 文本需描述操作或状态，不写"图片 N"：![](${src})`);
    if (!src.startsWith("/img/"))
      report("error", relPath, lineNo, "R7", `图片路径必须以 /img/ 开头（静态导出约束）：${src}`);
    else if (!existsSync(join(ROOT, "public", src)))
      report("error", relPath, lineNo, "R7", `图片文件不存在于 public 目录：${src}`);
  }

  // R8 链接
  for (const m of content.matchAll(/(?<!!)\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
    const url = m[2];
    const lineNo = content.slice(0, m.index).split("\n").length;
    if (url.startsWith("http://")) {
      report("warning", relPath, lineNo, "R8", `外部链接建议使用 https://：${url}`);
    } else if (url.startsWith("/")) {
      if (!url.startsWith("/docs/"))
        report("error", relPath, lineNo, "R8", `站内链接须为完整 /docs/... 路径：${url}`);
    } else if (url.includes("content/docs/")) {
      report("error", relPath, lineNo, "R8", `不要把公开 URL 写成源码路径 content/docs/...：${url}`);
    }
  }
}

// ---------------------------------------------------------------------------
// meta.json / 目录级检查（R9、R10）
// ---------------------------------------------------------------------------

function checkNavigation(files) {
  const addedMdx = files.filter(
    (f) => f.status === "A" && f.path.endsWith(".mdx") && f.path.startsWith(DOCS + "/"),
  );
  const dirsSeen = new Set();

  for (const { path } of addedMdx) {
    const dir = dirname(path);
    const base = path.slice(dir.length + 1).replace(/\.mdx$/, "");
    dirsSeen.add(dir);

    const metaPath = join(dir, "meta.json");
    const meta = readMetaJson(metaPath);
    if (meta === null)
      report("error", path, 1, "R10", `所在目录缺少 meta.json，页面不会进入侧边栏`);
    else if (meta === undefined)
      report("error", join(dir, "meta.json"), 1, "R10", "meta.json 不是合法 JSON");
    else if (Array.isArray(meta.pages) && !meta.pages.includes(base))
      report("error", join(dir, "meta.json"), 1, "R9", `新增页面 "${base}" 未列入所在目录 meta.json 的 pages`);

    // R10：父级 meta.json 须列入该目录（index 所在的根目录除外）
    if (dir !== DOCS) {
      const parentDir = dirname(dir);
      const dirName = dir.slice(parentDir.length + 1);
      const parentMeta = readMetaJson(join(parentDir, "meta.json"));
      if (parentMeta === null)
        report("error", join(parentDir, "meta.json"), 1, "R10", `父目录缺少 meta.json，子目录 "${dirName}" 不会进入导航`);
      else if (Array.isArray(parentMeta?.pages) && !parentMeta.pages.includes(dirName))
        report(
          "error",
          join(parentDir, "meta.json"),
          1,
          "R10",
          `新增目录 "${dirName}" 未列入父目录 meta.json 的 pages`,
        );
    }
  }

  // 被修改的 meta.json 若为非法 JSON 也要报
  for (const { path, status } of metaFiles) {
    if (status === "D") continue;
    if (readMetaJson(path) === undefined)
      report("error", path, 1, "R10", "meta.json 不是合法 JSON");
  }
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

for (const f of mdxFiles) {
  try {
    checkMdx(f.path, f.status);
  } catch (err) {
    report("error", f.path, 1, "SYS", `无法读取或解析：${err.message}`);
  }
}
checkNavigation(files);

// ---------------------------------------------------------------------------
// 输出：GitHub 注解 + Job Summary + 控制台
// ---------------------------------------------------------------------------

const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

for (const i of issues) {
  const cmd = i.level === "error" ? "::error" : "::warning";
  console.log(
    `${cmd} file=${i.file},line=${i.line},title=[${i.rule}] ${i.level === "error" ? "格式错误" : "格式建议"}::${i.message}`,
  );
}

const groupByFile = {};
for (const i of issues) (groupByFile[i.file] ??= []).push(i);

let summary = "";
if (issues.length === 0) {
  summary = "## ✅ 文档格式检查通过\n\n检查了 " + mdxFiles.length + " 个 .mdx 文件，未发现违规。\n";
} else {
  summary += `## 📋 文档格式检查结果\n\n**${errors.length} 个错误，${warnings.length} 个建议**（本检查当前为非阻断模式，详见 \`.trellis/spec/docs/contributing.md\`）\n\n`;
  for (const [file, list] of Object.entries(groupByFile)) {
    summary += `### \`${file}\`\n\n| 位置 | 级别 | 规则 | 说明 |\n|---|---|---|---|\n`;
    for (const i of list)
      summary += `| L${i.line} | ${i.level === "error" ? "❌ 错误" : "⚠️ 建议"} | ${i.rule} | ${i.message.replaceAll("|", "\\|")} |\n`;
    summary += "\n";
  }
}
console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}

console.log(
  `\n汇总：${mdxFiles.length} 个 .mdx 文件，${errors.length} 个错误，${warnings.length} 个建议。` +
    (strictFlag ? "（strict 模式）" : "（非阻断模式，设置 STRICT=1 可切换为阻断）"),
);
process.exit(strictFlag && errors.length > 0 ? 1 : 0);
