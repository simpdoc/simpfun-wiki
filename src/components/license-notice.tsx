import Link from 'next/link';
import { docLicense } from '@/lib/license';

/** 渲染在每篇文档正文末尾的开源许可声明 */
export function LicenseNotice() {
  return (
    <footer className="mt-10 border-t border-fd-border pt-4 text-sm text-fd-muted-foreground">
      <p>
        本文档内容采用{' '}
        <Link href={docLicense.deedUrl} rel="noreferrer noopener" target="_blank">
          {docLicense.full}（{docLicense.name}）
        </Link>{' '}
        许可协议授权：转载需署名，禁止商业用途，衍生作品须以相同协议共享。
      </p>
    </footer>
  );
}
