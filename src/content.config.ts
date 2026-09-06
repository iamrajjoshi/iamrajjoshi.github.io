import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogCollection = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.mdx",
    generateId: ({ entry }) => entry.replace(/\.mdx$/i, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60).min(10),
      homeTitle: z.string().optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      description: z.string().max(160),
      homeDescription: z.string().optional(),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      legacyGuid: z.url().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
