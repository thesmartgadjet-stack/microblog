import { defineCollection, z } from "astro:content";
const postsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.union([z.date(), z.string()]).transform((str) => new Date(str)),
      description: z.string(),
      author: z.string(),
      image: z.union([
        image(),
        z.string(),
        z.object({
          url: image(),
          alt: z.string(),
        }),
      ]),
      tags: z.array(z.string()).optional().default([]),
      category: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      canonical: z.string().optional(),
    }),
});
export const collections = {
  posts: postsCollection,
};
