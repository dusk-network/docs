import { defineCollection } from "astro:content";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

const i18n = defineCollection({
  loader: i18nLoader(),
  schema: i18nSchema(),
});

export const collections = { docs, i18n };
