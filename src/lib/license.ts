import { gitConfig } from './shared';

/** 文档内容的开源许可（对应仓库根目录 LICENSE-docs） */
export const docLicense = {
  name: 'CC BY-NC-SA 4.0',
  full: '署名-非商业性使用-相同方式共享 4.0 国际',
  deedUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh',
  licenseUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/LICENSE-docs`,
} as const;

/** 附加到 llms.txt / llms.mdx 导出内容末尾的许可声明（纯 Markdown 文本） */
export const licenseNoticeMarkdown = `## 许可声明

本文档（${'简幻欢社区维基'}）内容采用 [${docLicense.full} (${docLicense.name})](${docLicense.deedUrl}) 许可协议授权。
转载或衍生作品须署名来源、用于非商业目的，并以相同许可协议共享。完整许可文本见 [LICENSE-docs](${docLicense.licenseUrl})。`;
