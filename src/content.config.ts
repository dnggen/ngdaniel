import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cars = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cars" }),
  schema: z.object({
    name: z.string(),
    note: z.string().optional(),
    years: z.string().optional(),
    order: z.number().default(0),
  }),
});

const restaurants = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/restaurants" }),
  schema: z.object({
    name: z.string(),
    stars: z.number().default(0),
    city: z.string().optional(),
    note: z.string().optional(),
    order: z.number().default(0),
  }),
});

const tailors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tailors" }),
  schema: z.object({
    name: z.string(),
    location: z.string().optional(),
    instagram: z.string().optional(),
    order: z.number().default(0),
  }),
});

const albums = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/albums" }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional(),
    color: z.string().default("#7c7468"),
    cover: z.string().optional(),
    images: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { cars, restaurants, tailors, albums };
