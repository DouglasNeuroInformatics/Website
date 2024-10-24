import type { Language } from '@/i18n';

export function parsePostSlug(slug: string) {
  const regex = /(en|fr)\/(\d{4}-\d{2}-\d{2})_([^=]+)/;
  const result = regex.exec(slug);
  if (!result) {
    throw new Error(`Unexpected format for slug '${slug}': must match regular expression '${regex.source}'`);
  }
  const [language, dateString, name] = result.slice(1) as [Language, string, string];
  const timestamp = Date.parse(dateString);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid date '${dateString}' in slug '${slug}'`);
  }

  return {
    datePublished: new Date(timestamp),
    language,
    name,
    url: `/${language}/news/${name}`
  };
}
