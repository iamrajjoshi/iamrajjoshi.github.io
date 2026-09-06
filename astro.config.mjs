import { defineConfig, sharpImageService } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkReadingTime } from "./remark-reading-time.mjs";
import { toString } from "mdast-util-to-string";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const astroExpressiveCodeOptions = {
  themes: ["solarized-light", "solarized-dark"],
  useDarkModeMediaQuery: true,
  useThemedSelectionColors: true,
  defaultProps: {
    wrap: true,
    overridesByLang: {
      "bash,sh,shell,zsh,text": { wrap: false },
    },
  },
  customizeTheme(theme) {
    theme.name = theme.type;
  },
  styleOverrides: {
    borderColor: "var(--rule)",
    borderRadius: "0.125rem",
    borderWidth: "1px",
    codeBackground: [
      "var(--code-background, #332c25)",
      "var(--code-background, #f3e9d5)",
    ],
    codeForeground: ["var(--text, #fff9eb)", "var(--text, #28221c)"],
    codeSelectionBackground: "var(--selection)",
    codeFontFamily: "var(--font-mono)",
    codeFontSize: "0.875rem",
    codeLineHeight: "1.6",
    codePaddingBlock: "1rem",
    codePaddingInline: "1rem",
    focusBorder: "var(--focus)",
    scrollbarThumbColor: "color-mix(in srgb, var(--link) 36%, transparent)",
    scrollbarThumbHoverColor:
      "color-mix(in srgb, var(--link) 65%, transparent)",
    uiFontFamily: "var(--font-sans)",
    uiFontSize: "0.8125rem",
    uiFontWeight: "600",
    uiLineHeight: "1.4",
    uiPaddingBlock: "0.45rem",
    uiPaddingInline: "0.8rem",
    frames: {
      shadowColor: "transparent",
      frameBoxShadowCssValue: "none",
      editorBackground: "var(--code-background)",
      editorActiveTabBackground: "var(--code-background)",
      editorActiveTabForeground: "var(--muted)",
      editorActiveTabBorderColor: "var(--rule)",
      editorActiveTabIndicatorTopColor: "var(--link)",
      editorActiveTabIndicatorBottomColor: "transparent",
      editorTabBarBackground: "var(--surface)",
      editorTabBarBorderColor: "var(--rule)",
      editorTabBarBorderBottomColor: "var(--rule)",
      terminalBackground: "var(--code-background)",
      terminalTitlebarBackground: "var(--surface)",
      terminalTitlebarForeground: "var(--muted)",
      terminalTitlebarBorderBottomColor: "var(--rule)",
      terminalTitlebarDotsForeground: "var(--link)",
      terminalTitlebarDotsOpacity: "0.55",
      inlineButtonForeground: "var(--muted)",
      inlineButtonBackground: "var(--muted)",
      inlineButtonBorder: "var(--link)",
      inlineButtonBorderOpacity: "0",
      inlineButtonBackgroundHoverOrFocusOpacity: "0.12",
      inlineButtonBackgroundActiveOpacity: "0.2",
      tooltipSuccessBackground: "var(--link-hover)",
      tooltipSuccessForeground: "var(--background)",
    },
  },
};

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "prepend",
            content: {
              type: "text",
              value: "#",
            },
            headingProperties: (heading) => ({
              ariaLabel: toString(heading),
              className: ["anchor"],
            }),
            properties: (heading) => ({
              ariaLabel: `Permalink to “${toString(heading)}”`,
              className: ["anchor-link"],
            }),
          },
        ],
      ],
    }),
  },
  integrations: [sitemap(), expressiveCode(astroExpressiveCodeOptions), mdx()],
  image: {
    service: sharpImageService(),
  },
  site: "https://rajjoshi.me",
  redirects: {
    "/clips/": "https://clips.rajjoshi.me/",
  },
  vite: {
    plugins: [rawFonts([".ttf", ".woff"])],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});

// Vite plugin to import fonts for generated social images.
function rawFonts(ext) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_, id) {
      if (ext.some((extension) => id.endsWith(extension))) {
        const buffer = readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
