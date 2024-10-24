type Language = 'en' | 'fr';

function extractLanguageFromURL(url: Pick<URL, 'pathname'>) {
  const locale = url.pathname.split('/')[1];
  if (locale === 'fr') {
    return locale;
  }
  return 'en';
}

const useTranslations = (url: URL) => {
  const resolvedLanguage = extractLanguageFromURL(url);
  return {
    altLanguage: resolvedLanguage === 'en' ? 'fr' : 'en',
    resolvedLanguage,
    t: (translations: { [K in Language]: string }) => {
      return translations[resolvedLanguage];
    },
    translatePath: (path: string) => {
      return `/${resolvedLanguage}${path}`;
    }
  } as const;
};

export { useTranslations };
export type { Language };
