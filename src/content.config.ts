import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { localeEnum, defaultLocale } from "~/config/site";

const alternateLangSchema = z.partialRecord(localeEnum, z.string()).default({});

const customMetadataSchema = z.record(z.string(), z.string()).default({});

const authors = defineCollection({
  loader: glob({ pattern: "[^_]*.yml", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    meta: z.partialRecord(z.enum(["title", "description"]), z.string()).default({}),
    customMetadata: customMetadataSchema,
    alternate: alternateLangSchema,
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: "[^_]*.json", base: "./src/content/categories" }),
  schema: z
    .record(
      localeEnum,
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .refine((data) => defaultLocale in data, {
      message: `Every category must include the default locale ('${defaultLocale}').`,
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      category: reference("categories"),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: reference("authors"),
      /**
       * Optional feature image. Monograph's post feeds are deliberately
       * text-only, so a cover is only ever shown on the post itself.
       */
      cover: z
        .object({
          src: image(),
          alt: z.string(),
          creditName: z.string().optional(),
          creditUrl: z.url().optional(),
        })
        .optional(),
      /** Surfaces the post in the "Featured" list in the home sidebar. */
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts, categories, pages, authors };
