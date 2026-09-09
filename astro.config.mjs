// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import { siteConfig } from "./src/config/site.ts";
import { codeThemes, codeDefaultColor } from "./src/config/code.ts";

import mdx from "@astrojs/mdx";

import i18n from "@astrolicious/i18n";

const shikiConfig = /** @type {const} */ ({
  themes: codeThemes,
  defaultColor: codeDefaultColor,
});

export default defineConfig({
  site: siteConfig.siteUrl,
  integrations: [
    sitemap({
      filter: (page) => page !== new URL("/search/", siteConfig.siteUrl).toString(),
    }),
    mdx(),
    i18n({
      defaultLocale: "en",
      locales: ["en", "ar", "zh-CN", "de"],
      client: { translations: true, data: true },
      pages: {
        "/category/[category]": {
          ar: "/fia/[category]",
          de: "/kategorie/[category]",
          "zh-CN": "/fen-lei/[category]",
        },

        "/categories": {
          ar: "/fiat",
          de: "/kategorien",
          "zh-CN": "/fen-lei",
        },
      },
    }),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug],
    }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
