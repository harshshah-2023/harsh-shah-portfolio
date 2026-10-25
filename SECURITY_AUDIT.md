# Security Audit — harsh-shah-portfolio

| | |
|---|---|
| **Date** | 2026-10-25 |
| **Branch audited** | `feat/markdown-blog` (working tree incl. uncommitted changes), compared against `main` where relevant |
| **Scope** | All source in `src/`, `tools/blog/`, `content/blog/`, `public/`, `index.html`, build/lint config, `package.json` / lockfile, host config files, full git history (13 commits) |
| **Method** | Manual code review, `npm audit`, `npm outdated`, regex secret scan (working tree + every revision), fresh production build inspected in an isolated temp directory, hostile-input PoCs run through the project's real Markdown/frontmatter pipeline in a scratch directory |
| **Not done** | No requests were sent to the live Render site (not explicitly authorised for active testing). No dashboard access (Render, EmailJS, GitHub). No tools installed. The existing `dist/` was not touched. |

> The original audit (§1–§12) changed nothing. Remediation was applied afterwards on 2026-10-25 and is recorded in **§0**. The finding sections below keep their original wording, with a status line added to each.

---

## 0. Remediation status (2026-10-25)

### Before / after

| | Before | After |
|---|---|---|
| Findings (C/H/M/L) | 0 / 0 / 1 / 4 | 0 / 0 / 0 / 1 open in code (+ L-1 awaiting your Render action) |
| `npm audit` | 9 packages: **2 high**, 7 moderate | 5 packages: **0 high**, 5 moderate (accepted, not reachable; see §6) |
| Automated security tests | none | 56 (`npm test`) |
| Prerender with `$'` in a post | 120 `<head>` elements (corrupted page) | 1 `<head>`, literal text |
| `[x](/\evil.example)`-style link click in an article | navigated to `http://evil.example/` (confirmed in headless Chrome against the pre-fix build) | handled by the browser as a normal link; the SPA does not route it |

### Code fixes (done; uncommitted)

| ID | Fix | Files |
|---|---|---|
| **L-3** ✅ | `renderPage` passes replacer *functions* to `.replace`, so `$&`, `` $` ``, `$'`, `$1`, `$$`, `$<name>` are inserted literally. | `tools/blog/static-output.js` |
| **L-2** ✅ | `vite` 5.4.21 → **6.4.5**, `@vitejs/plugin-react-swc` 3.6.0 → **3.11.0** (esbuild 0.21.5 → 0.25.12). Clears all 8 Vite/launch-editor advisories and the esbuild advisory. | `package.json`, `package-lock.json` |
| **L-4** ✅ | `image-size` 1.2.1 → **2.0.4**. v2 reads buffers only, so `localImageSize` now reads the file itself. The function stays synchronous and image dimensions are unchanged (`1200×420` for the RAG diagram, verified in build and browser). | `package.json`, `package-lock.json`, `tools/blog/markdown.js` |
| **I-6** ✅ | Image-size lookups are confined to `public/`. A path that escapes it gets the existing "not found in public/" build warning and no dimensions. | `tools/blog/markdown.js` |
| **I-5** ✅ | `coverImage` must be a root-relative path (no `//`, `/\` or `..` segments) or an `https://` URL; anything else fails the build with a `ContentError` naming the file. All current posts pass. | `tools/blog/content.js` |
| **I-1** (defence in depth) ✅ | The in-article click handler no longer routes `/\host` (browsers treat it as `//host`). | `src/Pages/BlogPost.jsx` |
| `.gitignore` ✅ | `.env.*` ignored, `!.env.example` kept tracked. | `.gitignore` |
| **L-1** (prepared) ✅ | Headers defined once in `tools/security-headers.js` (CSP as **Report-Only**). `vite preview` serves them for local validation; `node tools/security-headers.js` prints the exact values for Render. The dev server is unaffected. | `tools/security-headers.js`, `vite.config.js` |
| Tests ✅ | `npm test` (Node's built-in runner, no new dependency): Markdown sanitisation (25 payloads + link/image behaviour), frontmatter/coverImage/slug/YAML validation, prerender integrity incl. every `$` pattern, draft exclusion, a real production build (well-formed pages, no drafts, no source maps or local paths, image dimensions, CSP hashes match the inline scripts), and a real dev server (drafts visible, hot reload on a new post). | `tests/*.js`, `package.json` (`test` script) |

### Dashboard actions that need you (not applied by me)

**Render: security headers (L-1).** Render reads headers from the dashboard, not from this repo.

1. Run `node tools/security-headers.js` to print the exact names and values.
2. Render Dashboard → your static site → **Settings → Headers** → **Add Header**. Add one rule per header, each with **Path** `/*`:

   | Name | Value |
   |---|---|
   | `Content-Security-Policy-Report-Only` | the full policy string from step 1 (one line) |
   | `Strict-Transport-Security` | `max-age=31536000` |
   | `X-Content-Type-Options` | `nosniff` |
   | `X-Frame-Options` | `DENY` |
   | `Referrer-Policy` | `strict-origin-when-cross-origin` |
   | `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
   | `Cross-Origin-Opener-Policy` | `same-origin` |

3. Save, then trigger **Manual Deploy → Deploy latest commit**, or wait for the next deploy. Headers apply on deploy.
4. Verify: `curl -sI https://harshshah.onrender.com/blog` shows all seven headers.
5. **Validate the CSP (Report-Only):** open the live site in Chrome with DevTools → Console. Visit home, projects, about, behind-the-build (+ a story), contact, blog, an article, and toggle the blog theme. Any `[Report Only] Refused to …` message is a policy gap. The policy has no `report-uri` because the site has no backend, so the console is the only place violations appear.
6. **Enforce** only after a clean run (ideally after a week of normal use): rename the header to `Content-Security-Policy`, both in Render and in `tools/security-headers.js`. `tests/build-output.test.js` asserts Report-Only on purpose, so update that assertion in the same change.

Keep in mind:
- If the inline theme script in `index.html` or the prerender script in `static-output.js` changes, its hash changes. `npm test` fails and prints the new hash, so update `tools/security-headers.js` and the Render value together.
- Don't add `includeSubDomains` or `preload` to HSTS on an `onrender.com` subdomain.

**Render: build settings (V-5).**
- Build command: `npm ci && npm run build`. Publish directory: `dist`.
- Vite 6 needs Node 18, 20 or ≥22; set the environment variable `NODE_VERSION=22`.
- Rewrite rule (V-4): `/*` → `/index.html`, action **Rewrite**.

**EmailJS (M-1 / V-1, V-2).**
- V-1 is resolved: you confirmed the template uses a literal recipient address.
- V-2 is still recommended: Account → Security → restrict allowed origins to `https://harshshah.onrender.com` (and any custom domain), and consider enabling reCAPTCHA.

**GitHub (V-7, V-9).** Branch protection on `main`, and Dependabot alerts enabled.

### Remaining risks (accepted / open)

| ID | Status | Why it remains |
|---|---|---|
| M-1 residual | **Low**, open | The relay risk is gone (literal recipient). The client-side throttle can still be bypassed to flood your inbox or burn the EmailJS quota. Mitigate with V-2. Sending `to_email` from the client is now harmless (the template ignores it); removing it is optional tidy-up and was not requested. |
| L-1 | Prepared, **awaiting Render dashboard** | It can't be applied from the repo. CSP enforcement is pending Report-Only validation on the live site. |
| I-1 | Accepted | `react-router` 6.30.6 advisories aren't reachable (no SSR, no visitor-controlled redirects; backslash guard added). The fix requires the v7 major upgrade, which is out of scope. |
| I-3 | Accepted | `postcss-selector-parser` under Tailwind 3.4.19: build-time only on our own CSS. No Tailwind 3.x patch exists; Tailwind 4 is a major migration, out of scope. I didn't force an `overrides` bump because it would put an untested major version under Tailwind 3. |
| I-4, I-7, I-8, I-9, I-10 | Accepted | Unchanged; informational. |
| New, Info | Accepted | A malformed URL hash (e.g. `#%E0%A4%A`) makes `decodeURIComponent` throw `URIError` in `BlogPost.jsx:213`. The article still renders and it's the same before and after; cosmetic only. Wrapping the decode in `try/catch` is a one-line follow-up. |

---

## 1. Executive summary

This is a statically built, client-rendered React portfolio. It has **no backend, no authentication, no user accounts and no user-generated content**. The only trust boundaries are:

1. **Site visitor → browser**: URL path and query parameters (`/blog/:slug`, `/behind-the-build/:slug`, `?q=`, `?tag=`), the URL hash, and the `blog-theme` key in `localStorage`.
2. **Site visitor → EmailJS**: the contact form, which calls `api.emailjs.com` directly using publishable credentials embedded in the bundle.
3. **Repository author → build**: Markdown and frontmatter in `content/blog/`, files in `public/`. Content is written by the site owner, so it is *trusted input*. It still gets hardened, as defence in depth and against a malicious pull request.

**Result:**

- **No Critical or High findings.** No exploitable XSS was found. Every visitor-controlled input reaches the DOM only through React's escaping, or is matched against a fixed allow-list.
- **The Markdown pipeline is safe against script injection.** 27 hostile payloads (raw HTML, `javascript:`/`data:`/`vbscript:` URLs, entity and case obfuscation, SVG, code-fence attribute breakout, footnotes, tables) all came out inert. Frontmatter payloads are correctly HTML-escaped in every prerendered sink (`<title>`, meta tags, JSON-LD, body, RSS, sitemap).
- **Drafts do not leak.** The one draft article (`building-ai-agents.md`) is absent from every JS chunk, prerendered HTML page, `rss.xml` and `sitemap.xml`. Only its cover SVG is published (Informational).
- **No secrets were found** in the working tree, the build output or any commit in history. The only credentials present are EmailJS *publishable* identifiers, which are designed to be public.
- **The most important real-world risk is the contact form (Medium, conditional).** The browser sends the recipient address (`to_email`) to EmailJS, and `.env.example` tells the owner to set the template's *To Email* field to `{{to_email}}`. If the live template is set up that way, anyone can use the public key to send arbitrary email *to arbitrary recipients* through the owner's EmailJS account. This code is **already on `main`/production**. Checking it takes two minutes in the EmailJS dashboard.
- **npm audit: 9 vulnerable packages (2 high, 7 moderate).** None of them is reachable in the production bundle. They affect the local dev server or build-time tooling only.

**Verdict: DEPLOY WITH DOCUMENTED RISKS**, on one condition: the EmailJS template's *To Email* must be a literal address, not `{{to_email}}`. If it is `{{to_email}}`, treat the verdict as **FIX BEFORE DEPLOYMENT** (see §11).

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| Medium | 1 (conditional on dashboard config) |
| Low | 4 |
| Informational | 10 |

---

## 2. Attack surface

| Surface | Where | Notes |
|---|---|---|
| `/blog/:slug` | `src/Pages/BlogPost.jsx:35-36` | Slug is only used as a lookup key in `posts.find()`; unknown slug → in-app 404. Never reflected as HTML. |
| `/behind-the-build/:slug` | `src/Pages/BuildStory.jsx:14-15` | Same lookup-only pattern. |
| `?q=` / `?tag=` | `src/Pages/Blog.jsx:24-26` | Used in `String.includes` matching and compared to known tag slugs; rendered only as React text. |
| URL hash | `src/Pages/BlogPost.jsx:212-213` | `decodeURIComponent` → `getElementById` → `scrollIntoView`. Not a sink. A malformed `%` sequence throws `URIError` inside an effect (cosmetic). |
| `localStorage["blog-theme"]` | `index.html:15`, `src/blog/theme.js:20-26` | Strict allow-list (`"dark"`/`"light"`), wrapped in `try/catch`. Not injectable. |
| Contact form → EmailJS | `src/lib/contactService.js` | See **M-1**. |
| Single HTML sink | `src/Pages/BlogPost.jsx:249` (`dangerouslySetInnerHTML`) | Input is build-time sanitised HTML from `tools/blog/markdown.js`. This is the **only** raw-HTML sink in the codebase (verified by grep for `innerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`). |
| Build pipeline | `tools/blog/*.js` | Reads `content/blog/*.md` and image files under `public/`; writes prerendered HTML, RSS, sitemap and robots.txt into `dist/`. |
| Dev server | `vite.config.js:13-15` | `vite@5.4.21` on `localhost:3000` (no `server.host`, so not LAN-exposed). |

---

## 3. Verified findings

### M-1 — Contact form may act as an open email relay through the owner's EmailJS account

| | |
|---|---|
| **Severity** | **Medium** (High abuse potential *if* the condition holds; Low if the template uses a literal recipient) |
| **Status** | Code behaviour **confirmed**; exploitability **depends on EmailJS dashboard config** that can't be checked locally |
| **Remediation** | **Relay risk resolved:** the owner confirmed the template uses a literal recipient (V-1). Residual Low risk (quota and inbox flooding) remains; see §0. |
| **Files** | `src/lib/contactService.js:13-15` (credentials), `:126` (`to_email: CONTACT_EMAIL` sent from client), `:138` (client-side-only throttle); `.env.example:4-6` (recommends `{{to_email}}` as the template's To field) |
| **Also on `main`** | Yes. `git show main:src/lib/contactService.js` line 126 contains the same `to_email` parameter, so production is affected today if the template matches. |

**Impact.** The service ID, template ID and public key are in the shipped JS (`assets/Contact-*.js`), which is how EmailJS is designed to work. The template parameters are also entirely client-controlled. If the template's *To Email* field is `{{to_email}}`, an attacker can call `https://api.emailjs.com/api/v1.0/email/send` directly with their own `to_email`, `subject` and `message`. That turns the owner's EmailJS service (and the connected Gmail/SMTP account) into a spam or phishing relay. The result would be:
- reputation damage and possible suspension of the connected mail account
- the EmailJS quota being exhausted, which breaks the contact form
- mail that appears to come from the owner's account

Even with a literal recipient, the client-side `limitRate` throttle (stored in the visitor's own browser) does nothing against a script. Anyone can still flood the owner's inbox and burn the quota, which is the lower-severity part of this finding.

**Conditions.** The attacker only needs the public bundle. Full relay abuse additionally requires *To Email* = `{{to_email}}` (or any other client-supplied variable) in the template.

**Safe verification (owner, no attack traffic needed).** In the EmailJS dashboard → *Email Templates* → `template_khi9en5` → *Settings*: check the **To Email** field. Also check *Account → Security*: is **"Allowed origins / domains"** restricted to the production domain? Is reCAPTCHA enabled?

**Remediation.**
1. Set the template's *To Email* to the literal owner address and remove `to_email` (and `to_name`) from `templateParams` (`contactService.js:125-126`). Update `.env.example:4-6` so it no longer recommends `{{to_email}}`.
2. In EmailJS account security, restrict allowed origins to `https://harshshah.onrender.com` (and any custom domain).
3. Optionally enable EmailJS's reCAPTCHA integration. This needs a small form change.
4. Keep the "From" fixed in the template and put the visitor's address only in *Reply-To*.

**Fix impact.** Step 1 has no visible change, provided the template is updated *before or with* the code. If the code drops `to_email` while the template still says `{{to_email}}`, sends will fail with "recipients address is empty". Step 2 breaks the form on `localhost` unless localhost is also allowed, or a separate dev template is used.

**Confidence.** High that the parameter is client-controlled. Medium that the live template is configured with `{{to_email}}`, because the repo's own setup guide recommends it.

---

### L-1 — No HTTP security headers are defined anywhere in the repository

| | |
|---|---|
| **Severity** | Low |
| **Status** | Confirmed absent from the repo; live response headers **not checked** (no requests sent to production) |
| **Remediation** | **Prepared, not applied:** `tools/security-headers.js` (CSP as Report-Only), served by `vite preview`; 0 violations across 11 routes in headless Chrome. Applying it needs Render dashboard steps (§0). |
| **Files** | No `render.yaml`; `vercel.json` and `public/_redirects` contain rewrites only |

**Impact.** Unless they are set in the Render dashboard, the site is served without:
- **Content-Security-Policy**: no second line of defence if a sanitiser regression ever slips into the single `dangerouslySetInnerHTML` sink
- **`frame-ancestors` / X-Frame-Options**: the site can be framed. The only state-changing UI is the contact form, so clickjacking impact is small.
- **X-Content-Type-Options: nosniff**
- **Referrer-Policy**: browser default `strict-origin-when-cross-origin` is acceptable
- **Strict-Transport-Security**: Render serves HTTPS, but HSTS should be confirmed
- **Permissions-Policy**

**Conditions.** None on their own. These are defence-in-depth controls, not an exploitable bug.

**Remediation.** Add headers via Render → Static Site → *Headers* (path `/*`), or a `render.yaml` `headers:` block. A CSP compatible with the current build, derived from the actual runtime origins in the bundle:

```
default-src 'self';
script-src 'self' 'sha256-<hash of index.html theme script>' 'sha256-<hash of prerender "js" class script>';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self' https://api.emailjs.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none'
```

Plus: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=31536000` (add `includeSubDomains` only for a custom domain you fully control), `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

**Fix impact.**
- There are two inline scripts: the theme script in `index.html:10-19`, and the `document.documentElement.classList.add("js")` script injected by `tools/blog/static-output.js:70`. Both need hashes, or a CSP violation will cause a theme flash and briefly show the prerendered markup.
- JSON-LD `<script type="application/ld+json">` is not executed, so it needs no allowance.
- `'unsafe-inline'` in `style-src` is required for framer-motion inline styles and the injected `<style>` at `static-output.js:71`.
- Ship it as `Content-Security-Policy-Report-Only` first.

**Confidence.** High that the repo defines none. Unknown for the dashboard.

---

### L-2 — Vulnerable Vite dev server (`vite@5.4.21`) on a Windows workstation

| | |
|---|---|
| **Severity** | Low (developer machine only; **not** production) |
| **Status** | Advisories confirmed by `npm audit`; reachability partially confirmed by code inspection |
| **Remediation** | **Resolved:** `vite@6.4.5`, `@vitejs/plugin-react-swc@3.11.0`. Build output is identical to Vite 5 apart from CSS minifier whitespace; the dev-server test (drafts, hot reload) passes. |
| **Advisories** | GHSA-4w7w-66w2-5vf9, GHSA-fx2h-pf6j-xcff (`server.fs.deny` bypass on Windows), GHSA-rq7h-c2jc-7f22, GHSA-9jrq-w75r-8gcw, and launch-editor GHSA-v6wh-96g9-6wx3 / -698v-4r3x-3vcv / -r825-w8mm-5pxw / -587h-7wmj-h5pm |

**Impact.** Only while `npm run dev` is running. The server binds to `localhost` only (`vite.config.js` sets no `server.host`), and 5.4.21 already restricts CORS reads and checks the `Host` header. That blocks the file-read advisories for cross-origin web pages. However, `node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js` mounts `/__open-in-editor` (launch-editor) with no origin check, so any web page open in the developer's browser can fire a no-CORS GET to it (e.g. `<img src="http://localhost:3000/__open-in-editor?file=…">`). The launch-editor advisories describe Windows-specific argument-escaping flaws that can lead to command execution with certain editors, or NTLM hash disclosure via UNC paths. Chrome's Local Network Access restrictions reduce, but don't eliminate, this risk.

**Conditions.** Dev server running + developer visits a malicious page + a vulnerable editor configuration.

**Remediation.** Upgrade to `vite@^6.4.5` (smallest jump that clears all listed advisories) or `vite@^7.3.7`. Also bump `@vitejs/plugin-react-swc` to `^3.11.0`, which supports Vite 4–7. Never run the dev server with `--host` on untrusted networks.

**Fix impact.** Vite 6 changes some defaults (e.g. `resolve.conditions`, Sass API). This project uses no Sass, SSR or custom resolve config, so breakage is unlikely, but the custom blog plugin (`configureServer`, `server.moduleGraph`, `server.ws.send`) must be smoke-tested in dev. Vite 7 needs Node ≥ 20.19 (local Node is 24.15; the Node version on Render needs checking).

**Confidence.** High for the advisories. Medium for real-world exploitability.

---

### L-3 — `$`-patterns in content corrupt prerendered HTML (`String.prototype.replace` replacement strings)

| | |
|---|---|
| **Severity** | Low (output-integrity / CWE-116; not attacker-reachable) |
| **Status** | **Confirmed with PoC** |
| **Remediation** | **Resolved:** replacer functions in `renderPage`; regression test `tests/prerender.test.js` covers `$'`, `` $` ``, `$&`, `$$`, `$1`, `$0`, `$<name>` (it failed before the fix with 120 `<head>`s). |
| **File** | `tools/blog/static-output.js:79`, `:81`, `:82` (`renderPage`) |

**Impact.** `renderPage` calls `template.replace(pattern, stringWithContent)`. JavaScript interprets `$&`, `` $` ``, `$'` and `$1` inside a *replacement string*. Any post whose title, description, author, tags or body contains those sequences gets template fragments spliced into the page. That is very plausible for a technical blog: bash `$'…'` quoting, regex `$&`, shell `$1`. In those spots the HTML escaping is effectively bypassed, because the spliced template text contains raw quotes and tags that break out of attribute values. The spliced markup is the site's own trusted template, so this is **not XSS**. It does produce broken prerendered pages: corrupted `<meta>`/Open Graph tags, a duplicated `<head>`, and a duplicated module `<script>`.

**Reproduction (safe, local).** A post whose body is ``Use `echo $'a\tb'` and `` x=$` `` here.``, run through `loadAllPosts` + `writeStaticOutput` in a scratch directory, produced a page with **2 `<head>` elements, 2 `<script type="module">` tags, and 15 `</body>` / `</html>` tags**. The current 8 published posts don't trigger it; the problem appears as soon as a post contains these sequences.

**Remediation.** Use a replacer *function* so the content is inserted literally, e.g. `.replace("</head>", () => \`    ${head}\n  </head>\`)`. Apply the same change to the `<title>` and `#root` replacements. The RSS `absolutise()` (`:211`) uses a constant pattern with a site-URL replacement and is fine.

**Fix impact.** None on current output (no current post contains these sequences). Add a regression test (§10).

**Confidence.** High.

---

### L-4 — `image-size@1.2.1` infinite-loop DoS advisories (build time)

| | |
|---|---|
| **Severity** | Low |
| **Advisories** | GHSA-5p2g-fcmc-qvqq (JXL/HEIF), GHSA-w3rx-r6r6-pgpr (ICNS) — reported *high* by npm |
| **Remediation** | **Resolved:** `image-size@2.0.4`, with `localImageSize` reading a buffer from inside `public/` only. |
| **Reachability** | `tools/blog/markdown.js:64` calls `imageSize()` on every root-relative image referenced in a post. `image-size` detects formats **by content, not file extension**, so a crafted file named `*.png` in `public/` would trigger the vulnerable parser. |

**Impact.** A hung `vite build` (local or on Render's build runner). There is no runtime or visitor impact. Reaching it requires committing a crafted image, i.e. repository write access or a merged malicious PR.

**Remediation.** Upgrade to `image-size@^2.0.4`. **This is an API change:** v2's main export reads buffers only, and file paths move to `image-size/fromFile` (`imageSizeFromFile`, async). That needs a small change to `localImageSize` (`markdown.js:61-70`), which is synchronous today inside a rehype visitor. Alternatively, read the file with `fs.readFileSync` and pass the buffer to `imageSize()`.

**Fix impact.** Requires a code change. Image `width`/`height` attributes must still be emitted (layout-shift regression risk).

**Confidence.** High.

---

## 4. Informational findings

| ID | Title | Evidence | Assessment / recommendation |
|---|---|---|---|
| I-1 | `react-router@6.30.6` advisories (GHSA-wrjc-x8rr-h8h6 backslash open redirect; GHSA-337j-9hxr-rhxg SSR `deserializeErrors`) | `npm audit`; `src/Pages/BlogPost.jsx:239-242` navigates on any href starting with `/` but not `//` | **Not reachable.** No route takes a redirect/next/return URL from the visitor. Every `<Link to>` is a constant or derived from `tagSlug()`/known slugs. The article click handler only sees build-time hrefs, and the PoC showed micromark percent-encodes backslashes (`[a](/\evil.com)` → `href="/%5Cevil.com"`). The SSR advisory needs SSR hydration (not used). As defence in depth, also reject `href[1] === "\\"` in the click handler. The upgrade path is react-router v7 (major); not needed before deploy. |
| I-2 | `esbuild` GHSA-67mh-4wv8-2f99 | `npm audit` | Affects `esbuild --serve`, which Vite 5's dev server does not use. Not reachable. Cleared by the Vite upgrade in L-2. |
| I-3 | `postcss-selector-parser` / `postcss-nested` / `tailwindcss` (GHSA-rj75-hqrm-r3gf, quadratic parsing) | `npm audit`; `npm ls` shows 6.1.5 under `tailwindcss@3.4.19` | Build-time only, on the project's own CSS. Not attacker-reachable. No patched Tailwind 3.x exists (3.4.19 is the latest 3.x). The only fix is Tailwind 4 (major migration). Accept the risk. |
| I-4 | Draft article's cover image is published | `public/blog/images/building-ai-agents.svg` is copied to `dist/blog/images/` | All other draft data (title, slug, body, metadata) is absent from every chunk, HTML page, RSS and sitemap (grep-verified on a fresh build). Only the artwork (aria-label "Agent loop") is public. Move draft-only assets outside `public/` if that matters. |
| I-5 | `coverImage` frontmatter isn't scheme-validated | `tools/blog/content.js:70-73`; PoC `coverImage: "javascript:alert(1)"` → `<img src="javascript:alert(1)">` | Not executable: browsers never run `javascript:` from `<img src>`, and the value is correctly attribute-escaped. It produces a junk `og:image` (`https://example.testjavascript:…`). Recommend allowing only `/…` or `https://…`. |
| I-6 | Image-size lookup isn't confined to `public/` | `tools/blog/markdown.js:64`; PoC `![x](/../src/assets/heroMain-800.webp)` emitted `width="800" height="640"` | The build reads files outside `public/`, but only image dimensions are disclosed and the input is author-controlled. Recommend checking that `path.resolve(...)` stays under `publicDir`. |
| I-7 | Pathological Markdown aborts the build | PoC: 50,000 nested `>` → `RangeError: Maximum call stack size exceeded` after ~7 s; 20k nested brackets 2.3 s; others < 0.5 s | Fails closed (build error, no hang, no bad output). Author-controlled. Acceptable. |
| I-8 | Sanitiser `clobberPrefix: ""` and unprefixed heading ids | `tools/blog/markdown.js:141`; `## root` → `id="root"` | Raw HTML is dropped, so ids/names come only from rehype-slug and footnotes. No app code reads `window.<id>` globals. In prerendered HTML the duplicate `#root` comes after the real mount node in document order, so `getElementById('root')` still resolves correctly. Low value to an attacker; optionally prefix heading ids or reserve `root`. |
| I-9 | Host config files that Render ignores | `vercel.json`, `public/_redirects` (Netlify syntax) | Not a vulnerability. On Render, the SPA rewrite `/* → /index.html` must exist in the dashboard (README §142-146 already says this). `_redirects` is copied into `dist/` and served as a harmless text file. |
| I-10 | Personal data in repo/history | `CONTACT_EMAIL` (`contactService.js:18`), resume PDF in `src/assets/`, a removed resume `Harshshah_resume_SDE.pdf` still in git history, author e-mail in commit metadata | Intentionally public for a portfolio. Note that deleting a file doesn't remove it from public GitHub history. If the old resume holds anything not meant to be public (phone, address), only a history rewrite removes it. |

---

## 5. Potential risks requiring manual verification

These can't be checked from the repository and must be checked in the respective dashboards:

| # | What to verify | Where | Why |
|---|---|---|---|
| V-1 | Template *To Email* is a literal address (not `{{to_email}}`) | EmailJS → Email Templates → `template_khi9en5` | Determines whether **M-1** is an open relay |
| V-2 | Allowed origins/domains restricted; reCAPTCHA status | EmailJS → Account → Security | Limits third-party abuse of the public key |
| V-3 | Response headers on the live site | Render → Static Site → Headers; or `curl -sI https://harshshah.onrender.com/` and `/blog` | **L-1**. Not run because active testing of production wasn't authorised. |
| V-4 | SPA rewrite `/* → /index.html` present (Rewrite, not Redirect) | Render → Redirects/Rewrites | Without it, deep links 404. Prerendered `/blog/*` files are served ahead of the rewrite. |
| V-5 | Build command `npm ci && npm run build`, publish dir `dist`, Node version pinned | Render → Settings / Environment | `npm ci` enforces the lockfile; `npm install` may drift. No `engines` field or `.nvmrc` exists. |
| V-6 | Render environment variables contain only `VITE_EMAILJS_*` and `SITE_URL` | Render → Environment | Any `VITE_*` variable is **inlined into the public bundle** by design. Never put a private key under a `VITE_` name. |
| V-7 | Auto-deploy branch is `main`; GitHub branch protection on `main`; PR deploy previews off or reviewed | Render + GitHub settings | A merged PR runs the build (and its plugins) on Render's builder |
| V-8 | Render/GitHub integration scoped to this one repository | GitHub → Settings → Applications → Render | Least-privilege for the deploy credential |
| V-9 | Dependabot alerts and security updates enabled | GitHub → Settings → Code security | There is no CI (`.github/` doesn't exist), so nothing runs `npm audit` automatically |

---

## 6. Dependency vulnerabilities

> **After remediation:** `npm audit` reports **5 moderate, 0 high, 0 critical**. Production-only (`--omit=dev`): 2 moderate (react-router, not reachable). The remaining dev entries are the Tailwind 3 / postcss-selector-parser chain (build-time). The Vite, esbuild and image-size rows below are resolved.

`npm audit` (lockfile as-is, 481 packages): **9 vulnerable packages, 2 high, 7 moderate, 0 critical.** The count of "eight" from the previous report has since grown to nine package entries, and they collapse to **five root causes**:

| Root package (installed) | Severity | Advisories | Ships to browser? | Reachable? | Recommended fix | Breaking? |
|---|---|---|---|---|---|---|
| `vite` 5.4.21 (+ `@vitejs/plugin-react-swc` 3.6.0 via peer, `esbuild` ≤0.24.2) | High | 8 Vite/launch-editor + 1 esbuild | No | Dev server only — **L-2** | `vite@^6.4.5` (or `^7.3.7`) + `@vitejs/plugin-react-swc@^3.11.0` | Semver-major for Vite; low expected breakage |
| `image-size` 1.2.1 | High | GHSA-5p2g-fcmc-qvqq, GHSA-w3rx-r6r6-pgpr | No | Build time, crafted file in `public/` — **L-4** | `image-size@^2.0.4` | API change; small code edit in `markdown.js` |
| `react-router` / `react-router-dom` 6.30.6 | Moderate | GHSA-wrjc-x8rr-h8h6, GHSA-337j-9hxr-rhxg | **Yes** | **No** — **I-1** | Stay on 6.30.x for now; plan v7 later | Major migration |
| `tailwindcss` 3.4.19 → `postcss-nested` → `postcss-selector-parser` 6.1.5 | Moderate | GHSA-rj75-hqrm-r3gf | No | No — **I-3** | None in 3.x; Tailwind 4 is a rewrite | Major migration |
| `esbuild` | Moderate | GHSA-67mh-4wv8-2f99 | No | No — **I-2** | Cleared by the Vite upgrade | — |

**Do the advisories pose real risk?** **Not to site visitors.** The only vulnerable package in the production bundle is `react-router`, and its two advisories aren't reachable in this app. The realistic exposure is to the **developer's Windows workstation while `npm run dev` is running** (Vite/launch-editor), plus a build-time hang that requires committing a malicious image.

**Outdated packages without known advisories** (`npm outdated`): `react`/`react-dom` 18.2.0 (18.3.1 available, drop-in), `@emailjs/browser` 4.4.1 (5.x available, check the changelog), `framer-motion`, `lucide-react`, ESLint 8 (EOL; v9+ requires flat config). None of these are security-blocking.

**Supply chain:**
- `package-lock.json` is committed.
- No package in the lockfile has `hasInstallScript`, so the install runs no lifecycle scripts.
- `package.json` scripts are standard (`vite`, `vite build`, `eslint`, `vite preview`).
- Caret ranges are used throughout. Render should use `npm ci` (V-5) so the lockfile is authoritative.

---

## 7. Exposed secrets assessment

| Check | Result |
|---|---|
| Regex scan of working tree (AWS, GitHub PAT/OAuth, OpenAI/Stripe `sk-`, Slack, Google `AIza`, Render `rnd_`, PEM private keys, `password/secret/token/api_key = "…"`) | **No matches** |
| Same scan over **all 13 revisions** in git history (excl. lockfile) | **No matches** |
| `.env`, `.pem`, `.key`, `.npmrc`, `credentials` files ever committed | **None.** Only `.env.example` (template, empty values) |
| `.gitignore` | Covers `.env`, `.env.local`, `*.local`, `dist`, `node_modules`. A future `.env.production` would **not** be ignored. Recommend adding `.env.*` with `!.env.example`. |
| Client bundle | Contains EmailJS service ID, template ID and **public** key (`assets/Contact-*.js`). These are publishable by EmailJS's design and in git history since `41ba227`. **No private key is present.** The abuse risk is covered by **M-1**, not by secrecy. |
| Source maps / local paths in build | No `.map` files, no `sourceMappingURL`, no `C:\Users` / `D:\port` / `localhost` paths in `dist` |
| Dev-only content in build | `import.meta.env.DEV` gap notes and draft stories in `src/behind-the-build/stories.js` are dead-code-eliminated (grep-verified) |

**Conclusion:** no credentials or secrets are exposed. Rotating the EmailJS public key isn't needed; restrict it at the EmailJS side instead (V-2).

---

## 8. Markdown and build pipeline — detail

**Pipeline** (`tools/blog/markdown.js:134-149`): `remark-parse → remark-gfm → remark-rehype` (no `allowDangerousHtml`, so raw HTML is **dropped**) `→ rehype-sanitize` (GitHub schema) `→ rehype-slug → headings → rehype-highlight → enhance → stringify`.

**Post-sanitise plugins re-checked.** Everything after sanitisation adds only generated nodes:
- anchor `href="#<slug>"`
- `target`/`rel` on `http(s)` links
- `loading`/`decoding`/`width`/`height` on images
- wrapper `div`/`figure`/`button` elements
- highlight.js `<span class>` tokens
- the code-fence language label, inserted as a **text node**

No input is re-parsed as HTML after sanitising.

**PoC results** (`renderMarkdown`, 27 cases; full list in the scratch script): raw `<script>`, `<img onerror>`, `<iframe>`, `<svg onload>`, HTML comments, `javascript:` (plain, mixed case, entity-encoded, tab-split, reference-style, autolink), `vbscript:`, `data:text/html` links, `javascript:`/`data:image/svg+xml` image sources, link-title quote breakout, code-fence language attribute breakout (`` ```js" onmouseover=…``), HTML inside fenced code / inline code / tables / footnotes.
**All inert.** Dangerous URLs lose their `href`/`src`, and quotes are entity-encoded. `javascript%3A…` survives as a *relative* URL (not executable). Protocol-relative `//evil.com` survives as a normal link, which is acceptable for author content.

**Frontmatter PoCs** (`loadAllPosts` + `writeStaticOutput`): `"></script><script>…<img onerror>` in title/description/author/tags/coverAlt is escaped in `<title>`, all meta tags, body, sitemap, RSS. In JSON-LD it is `<`→`\u003c` escaped. RSS `]]>` is correctly split. A YAML alias bomb is rejected by `yaml`'s alias limit in 5 ms. A filename `..%2fx.md` is rejected by `SLUG_RE`.

**Slug and path handling.**
- Slugs come from `path.basename` + `^[a-z0-9]+(?:-[a-z0-9]+)*$` (`content.js:8, 49-53`), so no traversal into output paths (`static-output.js:256`).
- Content files come from `readdirSync` of a fixed directory.
- The dev watcher (`vite-plugin-blog.js:77-87`) only invalidates virtual modules and has no file-path sink.
- The virtual module embeds data via `JSON.stringify` (safe JS literal).

**Dev vs production.**
- Drafts are included only when `command !== "build"` (`vite-plugin-blog.js:32, 42`).
- `vite preview` serves the built output and therefore excludes drafts.
- Dev-only Behind-the-Build text is gated on `import.meta.env.DEV`.
- No inconsistency was found that leaks content.

**Issues found in this area:** L-3, L-4, I-4, I-5, I-6, I-7, I-8.

---

## 9. OWASP coverage

### OWASP Top 10 (2021)

| Category | Status | Notes |
|---|---|---|
| A01 Broken Access Control | **N/A / Pass** | No protected resources. Draft exclusion verified (§8). |
| A02 Cryptographic Failures | **Verify** | No crypto in the app. HTTPS/HSTS depend on Render (V-3). |
| A03 Injection (incl. XSS) | **Pass** | One sanitised HTML sink; PoCs inert; React escaping elsewhere. L-3 is an integrity defect, not injection by an untrusted party. |
| A04 Insecure Design | **Finding** | M-1: client-controlled email recipient and client-only rate limit. |
| A05 Security Misconfiguration | **Finding** | L-1 missing headers; I-9 host config. |
| A06 Vulnerable & Outdated Components | **Finding** | §6; none exploitable in production. |
| A07 Identification & Auth Failures | **N/A** | No authentication. |
| A08 Software & Data Integrity | **Partial** | Lockfile present, no install scripts, no CI. Google Fonts CSS loaded without SRI (SRI is impractical for dynamic font CSS; acceptable). Build runs on Render from repo contents (V-7). |
| A09 Logging & Monitoring | **N/A** | Static site; EmailJS dashboard is the only log of contact-form abuse. |
| A10 SSRF | **N/A** | No server-side fetches. |

### OWASP ASVS 4.0 (Level 1, relevant chapters)

| Chapter | Status |
|---|---|
| V1 Architecture | Trust boundaries documented in §2. |
| V2/V3/V4 Auth, Session, Access Control | **N/A** |
| V5 Validation, Sanitisation, Encoding | **Pass**, except L-3 (encoding bypass via `$` patterns) |
| V7 Errors & Logging | Pass. Errors logged only in dev (`contactService.js:143`); user-facing messages generic. |
| V8 Data Protection | Pass. Only the theme preference is stored client-side; no PII stored. Contact data goes only to EmailJS. |
| V9 Communications | Verify (V-3). All referenced runtime origins are `https`; no mixed content found. |
| V10 Malicious Code | Pass. No `eval`/dynamic code; no install scripts. |
| V12 Files & Resources | Pass at runtime; I-6 at build time. |
| V13 API | **Finding**: M-1 (third-party API usable with client-supplied parameters). |
| V14 Configuration | **Finding**: L-1, L-2. No source maps in production (pass). |

### OWASP Secure Headers Project

| Header | Repo-defined | Recommendation |
|---|---|---|
| Content-Security-Policy | No | See L-1 (start Report-Only) |
| Strict-Transport-Security | No | `max-age=31536000` |
| X-Frame-Options / `frame-ancestors` | No | `DENY` / `'none'` |
| X-Content-Type-Options | No | `nosniff` |
| Referrer-Policy | No | `strict-origin-when-cross-origin` |
| Permissions-Policy | No | Disable camera/mic/geolocation |
| Cross-Origin-Opener-Policy | No | `same-origin` (optional; outbound links already use `noopener`) |

**Reverse tabnabbing:** every `target="_blank"` in `src/` carries `rel="noopener noreferrer"`. `window.open` calls pass `'noopener,noreferrer'` (`ProjectModal.jsx:33, 40`). Markdown external links get `rel="noopener noreferrer"` (`markdown.js:79-80`). **Pass.**

---

## 10. Prioritised remediation plan

| Priority | Item | Effort | Blocks deploy? |
|---|---|---|---|
| **P0** | **V-1/M-1**: check the EmailJS template recipient. If it is `{{to_email}}`, change it to a literal address, then remove `to_email`/`to_name` from `contactService.js:125-126` and fix `.env.example:4-6`. | 5 min dashboard + 2-line change | **Yes, if** the template uses `{{to_email}}` |
| **P1** | **V-2**: restrict EmailJS allowed origins; consider reCAPTCHA. | 5 min dashboard | No (strongly recommended) |
| **P1** | **L-1**: add security headers in Render (CSP as Report-Only first). | 30 min | No |
| **P1** | **L-3**: use replacer functions in `static-output.js:79-82`. | 3 lines | No (latent; fix before writing any post with `$'`/`$&`) |
| P2 | **L-2**: upgrade `vite` → `^6.4.5`, `@vitejs/plugin-react-swc` → `^3.11.0`; smoke-test dev + build. | 30 min | No |
| P2 | **L-4**: upgrade `image-size` → `^2.0.4` and adapt `localImageSize`. | 20 min | No |
| P2 | **V-5/V-9**: use `npm ci` on Render, pin Node (`engines` / `.nvmrc`), enable Dependabot. | 10 min | No |
| P3 | I-5/I-6: validate `coverImage` scheme; confine image lookup to `publicDir`. Add `.env.*` to `.gitignore`. Add a backslash guard in `BlogPost.jsx:240`. | 15 min | No |
| P3 | `react` 18.3.1 drop-in; plan react-router v7 / Tailwind 4 / ESLint 9 separately. | — | No |

## 11. Required regression tests

There is currently **no test runner** in the project. Recommended additions (Node's built-in `node:test` needs no new dependency):

1. **Sanitiser suite**: run the 27 payloads in §8 through `renderMarkdown`. Parse the output (e.g. with `hast-util-from-html`, already transitively available) and assert:
   - no `script`/`iframe`/`object`/`embed`/`svg`/`style` elements
   - no `on*` attributes
   - no `href`/`src` whose scheme is `javascript:`, `vbscript:` or `data:`

   Assert on the parsed DOM, not with regexes; regexes produce the false positives seen in this audit.
2. **Static output escaping**: a fixture post with `<`, `"`, `]]>`, `</script>` **and `$'`, `` $` ``, `$&`, `$1`** in every frontmatter field and in the body. Assert there is exactly one `<head>` and one module `<script>`, that meta values round-trip, and that RSS parses as XML.
3. **Draft exclusion**: after `vite build`, assert the draft's slug and title appear nowhere in `dist/**/*.{js,html,xml}`.
4. **Build artefact scan**: assert there are no `*.map` files, no `sourceMappingURL`, no absolute local paths, and only expected `VITE_*` values in `dist`.
5. **Contact payload**: assert `templateParams` contains no recipient field (after the M-1 fix).
6. **External-link rel**: every `target="_blank"` in rendered article HTML has `rel` containing `noopener`.
7. **After header changes**: `curl -sI` the live `/`, `/blog`, `/blog/<slug>` and check the expected headers. In a browser, confirm the console shows no CSP violations, the theme doesn't flash, the contact form still sends, and fonts load.
8. **After Vite / image-size upgrades**: `npm run build` still prerenders all published posts. Article `<img>` tags keep `width`/`height`. Dev-server hot reload on `.md` edits still works.

## 12. Production readiness verdict

> ### After remediation (2026-10-25): DEPLOY WITH DOCUMENTED RISKS
> V-1 is confirmed (literal recipient), so the conditional block is gone. All code-level findings are fixed and covered by `npm test` (56 passing), lint, a production build, and headless-Chrome regression runs (0 failures, 0 CSP violations). Remaining before you can call it done: apply the Render headers and validate the CSP in Report-Only mode (§0). Remaining accepted risks: react-router v6 and Tailwind 3 advisories (not reachable), and contact-form flooding (mitigate with EmailJS allowed origins).

*Original verdict:*

> ### DEPLOY WITH DOCUMENTED RISKS
> *conditional on V-1: confirm that the EmailJS template's **To Email** is a literal address, not `{{to_email}}`. If it is `{{to_email}}`, the verdict is **FIX BEFORE DEPLOYMENT** until P0 is done. The same exposure already exists on the current production build.*

Within the tested scope, no exploitable XSS, injection, secret exposure, draft leak or access-control issue was found. The remaining risks are a third-party API configuration question (M-1), missing defence-in-depth headers (L-1), dev/build-time dependency advisories (L-2, L-4) and a latent prerender-integrity bug (L-3).

This is not a claim that the application is fully secure. Dashboard settings, live response headers and runtime behaviour on Render were not verified, and §5 lists what still needs checking.

---

### Appendix — checks that could not be completed

- Live header and TLS inspection of `https://harshshah.onrender.com` (not authorised for active testing; command provided in V-3).
- EmailJS, Render and GitHub dashboard settings (no access).
- Browser-based dynamic testing of the running app. The XSS conclusions rest on the build-time output plus code review of the single HTML sink, which is sufficient because the HTML is fixed at build time.
- Content review of the PDF resumes (current and historical) for unintended personal data.
- The PoC scripts used are in the session scratchpad (not in the repo): `xss-poc.mjs`, `frontmatter-poc.mjs`, `inspect.mjs`, `dollar.mjs`.
