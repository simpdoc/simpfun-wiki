import { docsLlms } from '@/lib/source';
import { licenseNoticeMarkdown } from '@/lib/license';

export const revalidate = false;

export async function GET() {
  return new Response(`${await docsLlms.full()}`);
}
