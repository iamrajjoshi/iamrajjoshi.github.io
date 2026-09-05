# rajjoshi.me

Personal website. Plain HTML and CSS with a small JavaScript theme switcher.

The reusable visual primitives live in `site-foundation.css`, `theme.js`, and
`public/fonts/`. The blog keeps matching local equivalents so both sites can
build and deploy independently.

## Development

```bash
pnpm install
pnpm dev
```

The preview runs at <http://127.0.0.1:3000>. Build the deployable site or format the source with:

```bash
pnpm build
pnpm fmt
pnpm fmt:check
```

## Deploy

Push to `main` » GitHub Actions builds the static site and deploys `out/` to GitHub Pages.
