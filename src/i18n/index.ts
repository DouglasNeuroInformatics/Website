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
  const t = (translations: { [K in Language]: string }) => {
    return translations[resolvedLanguage];
  };
  return { resolvedLanguage, t } as const;
};

export { useTranslations };
