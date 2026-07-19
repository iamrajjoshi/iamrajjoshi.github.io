# rajjoshi.me

Personal website. Plain HTML and CSS with no client-side JavaScript.

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
