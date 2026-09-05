import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { defaultMeta } from "@data/constants";

export async function GET(context) {
  const blog = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    stylesheet: "/style.xsl",
    title: defaultMeta.title,
    description: defaultMeta.description,
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
