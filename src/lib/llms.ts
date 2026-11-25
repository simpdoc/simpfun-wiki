import { appName, siteUrl } from './shared';

/** llms.txt 索引头部的站点简介（llms.txt 规范建议：H1 后紧跟一段面向 AI 的说明） */
export const llmsSiteDescription = `简幻欢（SFE）服务器平台的第三方社区维基，内容涵盖简幻欢官网使用、Minecraft Java 版 / 基岩版服务端配置。本文件为站点索引，每个条目指向 ${siteUrl.origin}/llms.mdx 前缀下的 Markdown 文件，可按需逐个抓取；如需一次获取全部内容，请读取 llms-full.txt。`;

/** llms-full.txt 头部的站点说明（全站合集缺少索引上下文，需自述来源与用法） */
export const llmsFullHeader = `> 本文件为「${appName}」（${siteUrl.origin}）的全站内容合集，内容采用 CC BY-NC-SA 4.0 许可。如需按需精确引用，请先读取 /llms.txt 索引，再抓取 /llms.mdx 前缀下的单页 Markdown。`;
