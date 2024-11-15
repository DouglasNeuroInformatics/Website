import { defineCollection, reference, z } from 'astro:content';

const $BaseNewsItem = z.object({
  authors: z.array(reference('team')).min(1),
  description: z.string().min(1),
  extendedTitle: z.string().min(1).optional(),
  isDraft: z.boolean().optional(),
  title: z.string().min(1)
});

const $Article = $BaseNewsItem.extend({
  type: z.literal('article')
});

const $Link = $BaseNewsItem.extend({
  type: z.literal('link'),
  url: z.string().url()
});

const $Video = $BaseNewsItem.extend({
  src: z.string().url().startsWith('https://www.youtube.com/embed'),
  type: z.literal('video')
});

export const collections = {
  news: defineCollection({
    schema: z.union([$Article, $Link, $Video])
  }),
  projects: defineCollection({
    schema: z.object({
      contributors: z.array(reference('team')).min(1),
      dateCompleted: z.date().nullable(),
      description: z.object({
        en: z.string().min(1),
        fr: z.string().min(1)
      }),
      link: z.string().url().nullable(),
      technologies: z.array(reference('technologies')).min(1),
      title: z.object({
        en: z.string().min(1),
        fr: z.string().min(1)
      })
    }),
    type: 'data'
  }),
  team: defineCollection({
    schema: ({ image }) =>
      z.object({
        description: z.object({
          en: z.string().min(1),
          fr: z.string().min(1)
        }),
        fullName: z.string(),
        image: image().refine((arg) => arg.height === arg.width, {
          message: 'Image must be square (1:1 aspect ratio)'
        }),
        position: z.object({
          en: z.string().min(1),
          fr: z.string().min(1)
        }),
        seniority: z.number().positive().int(),
        suffix: z.enum(['MD', 'PhD']).optional()
      }),
    type: 'data'
  }),
  technologies: defineCollection({
    schema: ({ image }) =>
      z.object({
        icon: image(),
        invert: z.enum(['dark', 'light']).optional(),
        name: z.string()
      }),
    type: 'data'
  })
};
