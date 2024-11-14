import { defineCollection, reference, z } from 'astro:content';

const $BaseNewsItem = z.object({
  authors: z.array(reference('team')).min(1),
  description: z.string().min(1),
  isDraft: z.boolean().optional(),
  title: z.string().min(1)
});

const $Article = $BaseNewsItem.extend({
  type: z.literal('article')
});

const $Video = $BaseNewsItem.extend({
  src: z.string().url().startsWith('https://www.youtube.com/embed'),
  type: z.literal('video')
});

export const collections = {
  news: defineCollection({
    schema: z.union([$Article, $Video])
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
  })
};
