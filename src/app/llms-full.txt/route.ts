import { docsLlms } from '@/lib/source';
import { llmsFullHeader } from '@/lib/llms';

export const revalidate = false;

export async function GET() {
  const res = await docsLlms.serve('/llms-full.txt');
  if (!res) return new Response('Not Found', { status: 404 });

  // 在全站合集开头插入站点说明，让 AI 直接读取时也知道来源与许可。
  const text = await res.text();

  return new Response(`${llmsFullHeader}\n\n---\n\n${text}`, { headers: res.headers });
}
