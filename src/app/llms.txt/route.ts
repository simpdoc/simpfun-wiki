import { docsLlms } from '@/lib/source';
import { licenseNoticeMarkdown } from '@/lib/license';

export const revalidate = false;

export async function GET() {
  const res = await docsLlms.serve('/llms.txt');
  if (!res) return new Response('Not Found', { status: 404 });

  return new Response(`${await res.text()}\n\n---\n\n${licenseNoticeMarkdown}`, {
    headers: res.headers,
  });
}
