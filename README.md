# Harsh Shah — Portfolio

Personal portfolio built with React 18, Vite, Tailwind CSS, React Router and Framer Motion.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # eslint, must pass clean
```

## Contact form

The contact form posts through [EmailJS](https://dashboard.emailjs.com) from the
browser — there is no backend. Credentials live in `src/lib/contactService.js`
and are read from Vite env vars, falling back to the committed values:

| Variable | Purpose |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

Copy `.env.example` to `.env.local` to override them. These are publishable
browser credentials, not secrets.

**If messages stop arriving**, check the template in the EmailJS dashboard:

1. Its **To Email** field must be set (a literal address, or `{{to_email}}`).
2. Its body may reference `{{name}}`, `{{email}}`, `{{reply_to}}`,
   `{{subject}}` and `{{message}}` — the app sends each of those plus the
   common aliases (`from_name`, `from_email`, `user_name`, `user_email`,
   `title`), so any of the usual template authorings will resolve.
3. Your domain must be allowed under **Account → Security** if
   "Use allowlist" is enabled.

Failures surface the real EmailJS error in the UI and offer a pre-filled
`mailto:` fallback, so a misconfiguration is visible instead of silent.

## Routing on static hosts

This is a client-side routed SPA, so the host must rewrite unknown paths to
`index.html` or deep links like `/resume` return 404. `public/_redirects`
(Netlify / Render) and `vercel.json` (Vercel) are both included.

## Images

Source artwork is committed pre-optimized as WebP, in a card variant (~800px)
and a hero variant (~1600px). Add new artwork in both sizes and reference them
from `src/Components/ProjectGallary/projects.js`; a project with `image: null`
renders a branded gradient tile instead of a broken image.
