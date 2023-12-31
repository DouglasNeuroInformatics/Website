import { translations } from './translations';

type Language = 'en' | 'fr';

type ExtractTranslationKey<T extends Record<string, any>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? T[Key] extends Record<Language, string>
      ? Key
      : `${Key}.${ExtractTranslationKey<T[Key]>}`
    : `${Key}`
  : never;

type Translations = typeof translations;

type TranslationKey = ExtractTranslationKey<Translations>;

function getTranslation(key: TranslationKey, language: Language) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = key
    .split('.')
    .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    .reduce<any>((accumulator, currentValue) => accumulator?.[currentValue], translations);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (value[language] ?? value) as string;
}

function extractLanguageFromURL(url: URL) {
  const locale = url.pathname.split('/')[1];
  if (locale === 'fr') {
    return locale;
  }
  return 'en';
}

export function useTranslations(url: URL) {
  const resolvedLanguage = extractLanguageFromURL(url);
  const altLanguage = resolvedLanguage === 'en' ? 'fr' : 'en';
  const t = (key: TranslationKey) => {
    return getTranslation(key, resolvedLanguage);
  };
  const translatePath = (path: string, alt?: boolean) => {
    return `/${alt ? altLanguage : resolvedLanguage}${path}`;
  };
  return { altLanguage, resolvedLanguage, t, translatePath } as const;
}
