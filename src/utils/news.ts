import { toBasicISOString } from '@douglasneuroinformatics/libjs';
import type { CollectionEntry } from 'astro:content';

import type { Language } from '@/i18n';

function parsePost(post: CollectionEntry<'news'>) {
  const regex = /(en|fr)\/(\d{4}-\d{2}-\d{2})_([^=]+)/;
  const result = regex.exec(post.slug);
  if (!result) {
    throw new Error(`Unexpected format for slug '${post.slug}': must match regular expression '${regex.source}'`);
  }

  const [language, dateString, name] = result.slice(1) as [Language, string, string];
  const timestamp = Date.parse(dateString);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid date '${dateString}' in slug '${post.slug}'`);
  }

  const datePublished = new Date(timestamp);

  return {
    datePublished,
    language,
    name,
    url: post.data.type === 'link' ? post.data.url : `/${language}/news/${toBasicISOString(datePublished)}/${name}`
  };
}

function formatAuthors(authors: CollectionEntry<'team'>[], language: Language) {
  if (authors.length === 1) {
    return `${authors[0]!.data.fullName}${authors[0]!.data.suffix ? `, ${authors[0]!.data.suffix}` : ''}`;
  }
  return authors
    .map((author, i) => {
      let separator: string | undefined;
      if (i === authors.length - 1) {
        separator = { en: 'and', fr: 'et' }[language];
      } else if (i > 0) {
        separator = ',';
      }
      return separator ? `${separator} ${author.data.fullName}` : author.data.fullName;
    })
    .join(' ');
}

export { formatAuthors, parsePost };
