# UnscrambleHQ

Fast, clean word unscrambler MVP for unscramblehq.com.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- SEO metadata, robots, sitemap
- Client-side dictionary search engine

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Create a GitHub repo named `unscramblehq`.
2. Upload this project.
3. Import the repo into Vercel.
4. Add `unscramblehq.com` and `www.unscramblehq.com` in Vercel Domains.
5. Update DNS at your domain registrar using Vercel's instructions.

## Production note

The included dictionary is an MVP seed list so the app works immediately. Before major SEO launch, replace `lib/dictionary.ts` with a larger licensed word list such as ENABLE/SOWPODS/TWL-compatible data depending on your intended game coverage.
