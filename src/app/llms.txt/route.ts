import { docsLlms } from '@/lib/source';
import { licenseNoticeMarkdown } from '@/lib/license';
import { appName } from '@/lib/shared';
import { llmsSiteDescription } from '@/lib/llms';

export const revalidate = false;

export async function GET() {
  const res = await docsLlms.serve('/llms.txt');
  if (!res) return new Response('Not Found', { status: 404 });

  // 生成的索引以 `# 文档` 开头（来自 content/docs/meta.json 的标题），
  // 这里替换为站点名，并在其后插入 llms.txt 规范建议的站点简介。
  const text = await res.text();
  const body = text.slice(text.indexOf('\n') + 1);

  return new Response(`# ${appName}\n\n> ${llmsSiteDescription}\n${body}\n\n---\n\n${licenseNoticeMarkdown}`, {
    headers: res.headers,
  });
}
