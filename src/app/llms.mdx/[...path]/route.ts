import { docsLlms } from '@/lib/source';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/[...path]'>) {
  const { path } = await params;
  const res = await docsLlms.serve(`/${path.join('/')}`);

  return res ?? new Response('Not Found', { status: 404 });
}

export async function generateStaticParams() {
  const params: { path: string[] }[] = [];

  for (const file of await docsLlms.files()) {
    if (/^\/llms(-full)?\.txt$/.test(file)) continue;

    params.push({ path: decodeURI(file).slice(1).split('/') });
  }

  return params;
}
