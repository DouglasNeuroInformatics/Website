import type { CollectionEntry } from 'astro:content';

import type { Language } from '@/i18n';

export function formatTeamMembers(teamMembers: CollectionEntry<'team'>[], language: Language) {
  if (teamMembers.length === 1) {
    return `${teamMembers[0]!.data.fullName}${teamMembers[0]!.data.suffix ? `, ${teamMembers[0]!.data.suffix}` : ''}`;
  }
  return teamMembers
    .map((author, i) => {
      let separator: string | undefined;
      if (i === teamMembers.length - 1) {
        separator = { en: ' and ', fr: ' et ' }[language];
      } else if (i > 0) {
        separator = ', ';
      }
      return separator ? separator + author.data.fullName : author.data.fullName;
    })
    .join('');
}
