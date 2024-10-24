import { defineCollection, reference, z } from 'astro:content';

export const collections = {
  news: defineCollection({
    schema: z.object({
      author: reference('team'),
      description: z.string().min(1),
      isDraft: z.boolean().optional(),
      title: z.string().min(1),
      type: z.enum(['article']).default('article')
    })
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
