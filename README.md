# rajjoshi.me

Raj Joshi’s personal website and blog, built as one static Astro site.

## Routes

- `/` — personal site and selected work
- `/blog/` — writing index
- `/blog/<slug>/` — articles
- `/rss.xml` — RSS feed

Posts live in `src/content/blog` and support MDX, local images, footnotes, and
syntax-highlighted code blocks. The personal site and blog share one layout,
theme switcher, type scale, and visual foundation.

## Development

```bash
pnpm install
pnpm dev
```

The preview runs at <http://127.0.0.1:4321>. Validate and build the site with:

```bash
pnpm lint
pnpm build
```

## Deploy

Pushing to `main` runs the GitHub Pages workflow and deploys the generated
`dist/` directory to <https://rajjoshi.me>.

## Licenses

The blog began from Lance Ross’s Astro blog template. Its MIT license is
preserved in `LICENSES/blog-template-MIT.txt`. Figtree’s Open Font License is
preserved in `public/fonts/OFL.txt`.
