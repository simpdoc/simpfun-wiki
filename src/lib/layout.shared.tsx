import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { defineTranslations } from 'fumadocs-core/i18n';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { zhCN } from '@fumadocs/language/zh-cn';
import { appName, gitConfig } from './shared';

export const translations = defineTranslations().extend(uiTranslations()).preset(zhCN());

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: (
        <span className="flex items-center gap-2">
          <img src="/img/simpfun.png" alt="" className="h-7 w-auto" />
          <span>{appName}</span>
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
