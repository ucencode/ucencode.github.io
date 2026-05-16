# TODO

## SEO

- [x] **OG image** — create a 1200×630 social preview image, save to `/public/og-image.png`, then add to `src/layouts/BaseLayout.astro`:
  ```astro
  <meta property="og:image" content={new URL('/og-image.png', Astro.site).toString()} />
  ```

- [x] **JSON-LD structured data** — add a `Person` schema in `BaseLayout.astro` for richer Google Search results (name, job title, url, social profiles)

- [x] **theme-color** — add `<meta name="theme-color" content="...">` in `BaseLayout.astro` to tint the mobile browser chrome to match the site palette
