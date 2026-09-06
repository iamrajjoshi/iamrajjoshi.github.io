import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { blogMeta } from "@data/constants";

export async function GET(context) {
  const blog = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    stylesheet: "/style.xsl",
    title: blogMeta.title,
    description: blogMeta.description,
    site: new URL("/blog/", context.site),
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      customData: post.data.legacyGuid
        ? `<guid isPermaLink="true">${post.data.legacyGuid}</guid>`
        : undefined,
    })),
  });
}
