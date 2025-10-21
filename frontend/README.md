This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Monorepo deploy (this project) — Vercel + external backend

This repository is a monorepo with a Next.js frontend (`/frontend`) and a Spring Boot backend (`/backend`). Vercel will host the frontend; the backend should be hosted elsewhere (e.g., Railway, Render, Fly.io, Azure, etc.) and exposed via a public HTTPS URL.

1) Prepare the backend

- Deploy the Spring Boot app somewhere (Railway/Render are quick free options).
- Ensure CORS allows your Vercel domain(s). This project already includes a CORS config that allows:
	- http://localhost:3000
	- https://*.vercel.app (covers preview and production domains)

2) Set the API URL in the frontend

- The frontend reads the API base URL from `NEXT_PUBLIC_API_URL`.
- For local dev, copy `.env.local.example` to `.env.local` and edit if needed.
- On Vercel, set `NEXT_PUBLIC_API_URL` to your deployed backend URL (e.g., `https://your-backend-host.example.com`).

3) Create the Vercel project (Root Directory = `frontend`)

- Import the GitHub repo into Vercel.
- In Project Settings → General, set Root Directory to `frontend`.
- Framework Preset: Next.js (auto-detected).
- Build Command: `next build` (default). Output directory: `.next` (default).
- Environment Variables: add `NEXT_PUBLIC_API_URL` for both “Preview” and “Production”.

4) Deploy

- Vercel will build and deploy your frontend on pushes to the selected branch.
- Test the deployed site. If you see CORS errors in the browser console, double-check the backend’s allowed origins and the `NEXT_PUBLIC_API_URL` value.

Notes

- This app uses client-side fetches against the API; SSR calls also respect `NEXT_PUBLIC_API_URL` at build/runtime.
- If you later add a custom domain on Vercel, the existing `https://*.vercel.app` pattern continues to work; you can also add your custom origin to the backend CORS list for stricter control.
