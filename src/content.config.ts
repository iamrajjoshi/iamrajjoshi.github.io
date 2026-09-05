import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogCollection = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60).min(10),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      description: z.string().max(160),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
