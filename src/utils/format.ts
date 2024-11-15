import type { CollectionEntry } from 'astro:content';

export function formatTeamMembers(teamMembers: CollectionEntry<'team'>[]) {
  if (teamMembers.length === 1) {
    return `${teamMembers[0]!.data.fullName}${teamMembers[0]!.data.suffix ? `, ${teamMembers[0]!.data.suffix}` : ''}`;
  }
  return teamMembers
    .map((teamMember, i) => {
      if (i === 3) {
        return ', et al.';
      } else if (i > 3) {
        return;
      }
      let separator: string | undefined;
      if (i === teamMembers.length - 1) {
        separator = ' & ';
      } else if (i > 0) {
        separator = ', ';
      }
      return separator ? separator + teamMember.data.fullName : teamMember.data.fullName;
    })
    .join('');
}
