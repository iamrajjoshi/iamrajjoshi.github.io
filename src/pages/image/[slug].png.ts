import FigtreeRegular from "@fontsource/figtree/files/figtree-latin-400-normal.woff";
import FigtreeSemibold from "@fontsource/figtree/files/figtree-latin-600-normal.woff";
import { Resvg } from "@resvg/resvg-js";
import { blogMeta, defaultMeta } from "@data/constants";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { html } from "satori-html";

const dimensions = {
  width: 1200,
  height: 630,
};

interface Props {
  title: string;
  pubDate?: Date;
  siteLabel: string;
}

export async function GET(context: APIContext) {
  const { title, pubDate, siteLabel } = context.props as Props;
  const date = pubDate?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const titleSize = title.length > 48 ? "text-5xl" : "text-6xl";

  const markup = html`<div
    tw="flex flex-col w-full h-full bg-[#fff9eb] text-[#28221c] p-20"
  >
    <div tw="flex items-center text-xl text-[#0f766e]">
      <span>${siteLabel}</span>
    </div>
    <div tw="flex flex-1 items-center">
      <div
        tw="flex ${titleSize} font-semibold leading-tight tracking-tight max-w-5xl"
      >
        ${title}
      </div>
    </div>
    <div tw="flex w-20 h-px bg-[#0f766e] mb-7"></div>
    <div tw="flex items-center justify-between text-xl text-[#56534d]">
      <span>Raj Joshi</span>
      <span>${date ?? "Notes on building things"}</span>
    </div>
  </div>`;

  const svg = await satori(markup, {
    fonts: [
      {
        name: "Figtree",
        data: Buffer.from(FigtreeRegular),
        weight: 400,
      },
      {
        name: "Figtree",
        data: Buffer.from(FigtreeSemibold),
        weight: 600,
      },
    ],
    height: dimensions.height,
    width: dimensions.width,
  });

  const image = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: dimensions.width,
    },
  }).render();

  return new Response(Uint8Array.from(image.asPng()), {
    headers: {
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const posts = await getCollection("blog");

  return [
    {
      params: { slug: "site" },
      props: { title: defaultMeta.title, siteLabel: "rajjoshi.me" },
    },
    {
      params: { slug: "blog" },
      props: { title: blogMeta.title, siteLabel: "rajjoshi.me/blog" },
    },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: {
        title: post.data.title,
        pubDate: post.data.pubDate,
        siteLabel: "rajjoshi.me/blog",
      },
    })),
  ];
}
