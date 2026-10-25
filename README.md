# Harsh Shah – Portfolio Website 🚀

Personal portfolio website showcasing my work as a **Software Product Engineer**.
The site highlights my projects, technical expertise, and experience building **scalable, real-time, and production-ready systems**.

---

##  Live Demo
🔗 https://harshshah.onrender.com

---

##  Tech Stack

### **Frontend**
- React 18
- Vite (fast build & HMR)
- JavaScript (ES6+)
- Tailwind CSS (design tokens & responsive design)
- React Router (client-side routing)
- Framer Motion (animation)
- EmailJS (contact form delivery)

### **Tooling & Quality**
- ESLint (code quality & consistency)
- Vite HMR for rapid development
- Optimized production builds with route-level code splitting

---

##  Features
- Clean, minimal, and responsive UI
- Fast load times with Vite bundling and per-route chunks
- Project showcase with real-world focus
- Working contact form with validation and a mailto fallback
- Markdown blog: drop a `.md` file in `content/blog/` to publish (see [BLOG_GUIDE.md](BLOG_GUIDE.md))
- Optimized for desktop and mobile devices

---

## 📂 Project Structure

```
├── content/
│   └── blog/                # one Markdown file per article
├── public/
│   ├── blog/images/         # article covers and inline images
│   ├── ProfilePic.webp
│   └── _redirects
├── tools/
│   └── blog/                # Vite plugin: Markdown -> HTML, prerender, sitemap, RSS
├── src/
│   ├── assets/
│   ├── blog/                # post helpers, per-page <head> metadata
│   ├── Components/
│   │   ├── Blog/            # cards, TOC, reading progress, share, author bio
│   │   ├── common/          # ScrollToTop, PageLoader, NotFound
│   │   └── ProjectGallary/  # gallery, hero, modal, project data
│   ├── Pages/
│   ├── lib/                 # contactService (EmailJS)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css            # Tailwind layers + design primitives
├── index.html
├── tailwind.config.js       # design tokens: colour, type, elevation
├── vite.config.js
├── vercel.json
└── package.json
```

---

##  Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/harshshah-2023/harsh-shah-portfolio.git
cd harsh-shah-portfolio
npm install
```

### Development
```bash
npm run dev
```
Runs the app locally on port 3000 with Hot Module Replacement (HMR).

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```
Must pass clean — the script runs with `--max-warnings 0`.

---

## ✉️ Contact Form

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

---

## 🌐 Routing on Static Hosts

This is a client-side routed SPA, so the host must rewrite unknown paths to
`index.html` or deep links like `/resume` return 404. `public/_redirects`
(Netlify-style) and `vercel.json` (Vercel) are both included; on Render the
equivalent is a **Rewrite** rule `/*` → `/index.html` under the static site's
*Redirects/Rewrites* settings.

The blog is the exception: `npm run build` also writes real HTML files for
`/blog` and every `/blog/<slug>` (as both `<slug>.html` and
`<slug>/index.html`), with per-article titles, descriptions, canonical URLs,
Open Graph tags and structured data, plus `sitemap.xml`, `rss.xml` and
`robots.txt`. Hosts serve those files ahead of the SPA fallback.

---

## 🖼️ Images

Source artwork is committed pre-optimized as WebP, in a card variant (~800px)
and a hero variant (~1600px). Add new artwork in both sizes and reference them
from `src/Components/ProjectGallary/projects.js`; a project with `image: null`
renders a branded gradient tile instead of a broken image.

---

## 🎨 Design System

Colour, type scale, spacing, elevation and motion are defined as tokens in
`tailwind.config.js`, with shared surface primitives in `src/index.css`:

- `ink-*` — cool-tinted background surfaces
- `mist-*` — text ramp (all steps meet WCAG AA on every ink surface)
- `accent-*` — brand accent, `accent-500` is `rgb(70,135,145)`
- `edge` — hairlines and translucent fills (`border-edge/[0.08]`); white on dark, near-black on light

Colour tokens are CSS variables defined in `src/index.css`. Dark is the site
default; the blog section sets `<html data-theme="light">` (its default) or
`"dark"` via the navbar switch (`src/blog/theme.js`), which swaps the whole
palette. Use the tokens rather than raw `white/…` or hex values so components
follow the theme.
- `shadow-e1`–`e4` — multi-layer elevation; `shadow-glow` for accent lifts
- `.surface` / `.surface-interactive` / `.eyebrow` — shared component classes

Prefer these over one-off arbitrary values so the system stays consistent.

---

## ⚡ Vite + React Setup

This project uses Vite for fast builds and HMR with React support.

Available official plugins:

- `@vitejs/plugin-react` – Babel-based Fast Refresh
- `@vitejs/plugin-react-swc` – SWC-based Fast Refresh (faster builds, used here)

---

## 📫 Contact

- Portfolio: https://harshshah.onrender.com
- LinkedIn: https://www.linkedin.com/in/harsh-shah-9848hs
- Email: harshshah9848@gmail.com

<p align="center"><i>Always learning. Always shipping.</i></p>
