import { getCollection } from "astro:content";
import { formatDate, postHref, readingLabel, visiblePosts } from "~/lib/posts";
import { getDefaultLocale, getLocale } from "i18n:astro";

/**
 * Static search index consumed by the header command palette. It holds post
 * metadata only, never the article body, so it stays small enough to fetch on
 * the first search.
 */
export async function GET() {
  const locale = getLocale();
  const defaultLocale = getDefaultLocale();

  const allCategories = await getCollection("categories");
  const categoryNameMap = new Map(
    allCategories.map((c) => [c.id, (c.data[locale] ?? c.data[defaultLocale]).name]),
  );

  const allAuthors = await getCollection("authors");
  const authorNameMap = new Map(allAuthors.map((a) => [a.id, a.data.name]));

  const posts = visiblePosts(await getCollection("posts"));
  const index = posts.map((post) => ({
    title: post.data.title,
    excerpt: post.data.excerpt,
    href: postHref(post),
    author: authorNameMap.get(post.data.author.id) ?? "",
    category: categoryNameMap.get(post.data.category.id) ?? "",
    date: formatDate(post.data.date),
    reading: readingLabel(post),
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
