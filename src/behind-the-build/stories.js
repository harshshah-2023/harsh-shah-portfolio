/**
 * Behind the Build — engineering stories.
 *
 * Content only; every page and component reads from here, so adding a story
 * means adding an object to STORIES and nothing else.
 *
 * Every story follows the same seven sections (SECTIONS below). A section is
 *
 *   { body?: string[], items?: string[], tradeoffs?, diagram?, code?,
 *     metrics?, timeline?, gap?: string }
 *
 * Ground rules for content:
 * - Only facts that can be traced to a source listed in `sources`.
 * - Anything not yet known goes in `gap` (what is missing and who can supply
 *   it). Gaps render as visible notes on the dev server and are left out of
 *   production builds, as are stories with `status: "draft"`.
 * - Nothing confidential: no customer names, internal architecture or data.
 */

export const SECTIONS = [
  { key: "problem", label: "The Problem", hint: "What wasn't working, and why it mattered" },
  { key: "constraints", label: "The Constraints", hint: "What made it hard" },
  { key: "decision", label: "The Decision", hint: "The approach, and why" },
  { key: "tradeoffs", label: "The Trade-offs", hint: "What was rejected, what was given up" },
  { key: "implementation", label: "The Implementation", hint: "How it was engineered" },
  { key: "outcome", label: "The Outcome", hint: "What changed, measured where possible" },
  { key: "lesson", label: "The Lesson", hint: "What I'd keep, and what I'd change" },
];

const STORIES = [
  /* ======================================================================
     1. Portfolio performance pass
  ====================================================================== */
  {
    slug: "halving-the-first-load",
    status: "published",
    title: "Halving the first load without moving a pixel",
    dek: "This portfolio shipped 367 kB of JavaScript to render its home page and 2.1 MB to show six project cards. The fix had to leave every layout exactly as it was.",
    domain: "Frontend performance",
    year: "2026",
    role: "Sole engineer",
    stack: ["React 18", "Vite", "Tailwind CSS", "WebP"],
    call: "Split by route, keep the entry page eager, and re-encode every image at the size it is actually shown.",
    headline: { value: "367 → 188 kB", label: "initial JavaScript" },

    problem: {
      body: [
        "The site looked finished but behaved like a draft. The home page downloaded framer-motion, react-icons and the full project dataset before it could paint, the Projects page transferred 2,106 kB, and on a throttled connection the home page's largest paint landed at roughly 2.25 seconds.",
        "Underneath the weight were plain bugs: a resume download button that was commented out, deep links like /resume that returned 404 on static hosts, project cards pointing at an image URL nothing served, and a lint run that failed with 100 errors.",
      ],
    },

    constraints: {
      items: [
        "Layout, grid and content had to stay exactly as they were. This was a repair, not a redesign.",
        "Static hosting with an SPA rewrite. There is no server to do anything clever at request time.",
        "The decorative background glows stayed. They were replaced, not removed.",
      ],
    },

    decision: {
      body: [
        "Treat it as a measurement problem first. Before changing code, I checked what was actually being shipped and why. Three causes stood out: everything was in one bundle, images were served at source resolution, and two 200px blur filters were forcing the browser to re-rasterise a full-viewport surface on every scroll frame.",
        "Each cause got the most boring fix that works: route-level code splitting, WebP at the two sizes the layout uses, and radial gradients in place of blur filters.",
      ],
    },

    tradeoffs: {
      tradeoffs: [
        {
          chose: "Code-split every route except Home",
          over: "One bundle for the whole site",
          why: "Home is the entry point for most visits, so it stays in the main bundle. Every other route becomes its own chunk, and the first paint no longer pays for framer-motion, react-icons or the project dataset.",
          cost: "The first visit to any other page waits for a chunk to download, so a loading state now has to exist and look right.",
        },
        {
          chose: "Radial gradients for the background glow",
          over: "blur-[200px] filters on large elements",
          why: "A large blur filter makes the browser rasterise and re-composite a huge surface on every scroll and hover frame. A gradient is painted once.",
          cost: "A gradient approximates the glow rather than reproducing the blurred shape exactly.",
        },
        {
          chose: "Two encoded sizes per hero image, chosen with srcset",
          over: "One large image for every screen",
          why: "Phones should not download the desktop asset. The browser picks the 800w or 1400w file from the rendered width.",
          cost: "Every artwork now exists as two files that have to be regenerated together.",
        },
        {
          chose: "Delete unused dependencies and unreferenced images",
          over: "Leave them in case they're needed later",
          why: "three, @react-three/fiber, @react-three/drei and emailjs-com were not imported anywhere, and 2.6 MB of images were not referenced.",
          cost: "Bringing any of them back means reinstalling them on purpose.",
        },
      ],
    },

    implementation: {
      body: [
        "The routing change is small. Pages become lazy imports behind a single Suspense boundary, and Home is imported directly so the most common landing stays on the critical path.",
        "Hero images carry intrinsic dimensions so their box is reserved before they load (no layout shift), load eagerly at high priority because they are the largest paint, and offer two widths.",
      ],
      code: [
        {
          file: "src/App.jsx",
          lang: "jsx",
          source: `// Home stays in the main bundle (it is the entry point for most visits).
// Every other route is split into its own chunk so the first paint does not
// pay for framer-motion, react-icons and the full project dataset.
import Home from './Pages/Home';

const Contact = lazy(() => import('./Pages/Contact'));
const Projects = lazy(() => import('./Pages/Projects'));`,
        },
        {
          file: "src/Pages/Home.jsx",
          lang: "jsx",
          source: `<img
  src={heroMain}
  srcSet={\`\${heroMainSmall} 800w, \${heroMain} 1400w\`}
  sizes="(max-width: 1024px) 95vw, 45vw"
  width={1400}
  height={1120}
  loading="eager"
  fetchPriority="high"
  decoding="async"
/>`,
        },
      ],
    },

    outcome: {
      body: [
        "Measured on the same pages before and after. Paint timings were taken with 4× CPU throttling on a connection of about 1.6 Mbps. The layout did not change.",
        "The same pass fixed the broken pages, brought all 356 text nodes across six pages to WCAG AA (the first audit found 32 failures at 3.2–4.35:1), and took lint from 100 errors to zero. A headless-Chrome run passed 29/29 interaction checks and 15/15 contact-form checks with no console errors.",
      ],
      metrics: [
        { label: "Initial JavaScript", before: 367, after: 188, unit: "kB", note: "120 → 61 kB gzipped" },
        { label: "Projects page transfer", before: 2106, after: 147, unit: "kB" },
        { label: "Home largest contentful paint", before: 2250, after: 1650, unit: "ms", approx: true },
        { label: "Home DOMContentLoaded", before: 1150, after: 790, unit: "ms", approx: true },
        { label: "MahaKavach hero image", before: 1541, after: 96, unit: "kB" },
      ],
    },

    lesson: {
      body: [
        "The biggest wins weren't clever optimisations. They came from images served far larger than they were displayed and from libraries loaded on pages that never used them. Measuring before changing anything is what made that visible, and that order is what I'd keep.",
      ],
    },

    timeline: [
      { date: "2025-07", label: "First version of the portfolio goes up" },
      { date: "2025-11", label: "Full UI revamp; profile image moved to WebP" },
      { date: "2026-01", label: "Resume download fixed (PDF import and anchor)" },
      { date: "2026-08", label: "Repair and performance pass described here", current: true },
      { date: "2026-10", label: "Markdown blog with prerendered articles" },
    ],

    links: [
      { label: "The site itself", to: "/" },
      { label: "Projects page, after the pass", to: "/projects" },
    ],
    sources: [
      { label: "Commit 6cec154 — “Fix broken pages, add current role, cut load weight, unify design system”" },
      { label: "src/App.jsx, src/Pages/Home.jsx, src/Pages/Resume.jsx (comments on the blur → gradient change)" },
    ],
  },

  /* ======================================================================
     2. Markdown blog on a static SPA
  ====================================================================== */
  {
    slug: "publishing-without-a-server",
    status: "published",
    title: "Publishing to a static SPA without losing link previews",
    dek: "I wanted to publish an article by adding one Markdown file, with no CMS and no backend. On a client-rendered site, that normally means every shared link shows the same blank card.",
    domain: "Build tooling",
    year: "2026",
    role: "Sole engineer",
    stack: ["Vite plugin API", "unified / remark / rehype", "React Router", "Static hosting"],
    call: "Compile Markdown at build time into a virtual module, and prerender a real HTML page per article next to the SPA.",
    headline: { value: "1 file", label: "to publish an article, sitemap entry and RSS item" },

    problem: {
      body: [
        "The portfolio is a client-rendered single-page app. Every URL serves the same empty index.html and React fills it in. That's fine for people, but for a blog it means link previews on LinkedIn, X or Slack all show the generic site card, and crawlers that don't run JavaScript see no article text at all.",
        "I also wanted writing to be a content task, not a code change: drop a Markdown file in a folder, and the article, its index entry, the sitemap and the RSS feed all update.",
      ],
    },

    constraints: {
      items: [
        "Static hosting with an SPA rewrite (Vercel and Render). The design had to work without hosting changes.",
        "No backend. The site doesn't have one, and adding one for a blog wasn't worth it.",
        "The blog has its own light theme while the rest of the site stays dark. A blog page must never flash dark before React mounts.",
        "Untrusted formatting in posts must not become an XSS vector.",
      ],
    },

    decision: {
      body: [
        "Do the work at build time, inside the existing Vite build. A small plugin reads content/blog/*.md, validates frontmatter, compiles Markdown to sanitised HTML, and exposes the result as a virtual module the app imports like any other.",
        "For crawlers and link previews, the same build writes a prerendered HTML file for /blog and every /blog/<slug>, each with its own title, description, canonical URL, Open Graph tags and JSON-LD. Static hosts serve an existing file ahead of the SPA rewrite, so this needs no hosting configuration.",
      ],
    },

    tradeoffs: {
      tradeoffs: [
        {
          chose: "Compile Markdown at build time",
          over: "Parse Markdown in the browser",
          why: "None of the Markdown tooling ships to the browser, and the HTML is already sanitised and highlighted before it reaches a reader.",
          cost: "Publishing an article needs a build and a deploy. There's no live editing.",
        },
        {
          chose: "A small metadata index plus one lazy chunk per article",
          over: "Bundling every article into the blog page",
          why: "The blog index never downloads article bodies. An article's header can paint immediately from metadata while its body loads.",
          cost: "Article pages need a loading state for the body, and there are as many chunks as articles.",
        },
        {
          chose: "Prerendered HTML files alongside the SPA",
          over: "Accepting generic previews for a client-rendered blog",
          why: "Each article gets correct head tags and readable markup without a server. Visitors with JavaScript never see the prerendered markup because React replaces it on mount.",
          cost: "Hosts differ in how they map /blog/x to a file, so every page is written twice (x.html and x/index.html).",
        },
        {
          chose: "Drop raw HTML in posts and sanitise with GitHub's allow-list",
          over: "Passing author HTML through",
          why: "A Markdown file can't inject scripts or javascript: URLs. Every element added after sanitising is generated by the pipeline, never taken from input.",
          cost: "Authors can't embed custom HTML. Anything richer has to become a pipeline feature.",
        },
      ],
    },

    implementation: {
      body: [
        "The plugin answers imports of virtual:blog with generated code. Metadata ships inline, and each article body becomes its own dynamic import, so Vite gives every article its own chunk.",
        "The theme problem is solved before React exists. A tiny inline script in index.html reads the saved theme and sets data-theme on <html> during parsing, so the first paint is already correct.",
        "Broken content fails loudly. A missing title or a malformed date stops the build with a message naming the file and the field, so a broken page can't be published.",
      ],
      diagram: {
        caption: "Select a stage to see what it does.",
        lanes: [
          {
            label: "Every build and dev server",
            nodes: [
              { id: "md", label: "content/blog/*.md", detail: "One file per article. The file name is the URL. Drafts (draft: true) load only on the dev server." },
              { id: "validate", label: "Frontmatter check", detail: "Required fields and date formats are validated, and a UTF-8 byte-order mark from Windows editors is stripped. Any error stops the build and names the file and field." },
              { id: "compile", label: "remark → rehype", detail: "GitHub-flavoured Markdown is converted to HTML with raw HTML dropped, then sanitised against GitHub's allow-list. Headings get ids and anchors, code is highlighted, and local images get intrinsic sizes so they don't shift layout." },
              { id: "virtual", label: "virtual:blog", detail: "A generated module exporting the post metadata list and a loadPost(slug) function that dynamically imports one article, so each article is its own chunk." },
              { id: "spa", label: "/blog · /blog/:slug", detail: "React routes render the index from metadata immediately and fetch an article body on demand." },
            ],
          },
          {
            label: "Production build only",
            nodes: [
              { id: "html", label: "Prerendered HTML", detail: "/blog and every article get a real HTML file with their own head tags and readable markup, served by static hosts ahead of the SPA rewrite." },
              { id: "feeds", label: "sitemap · RSS · robots", detail: "Written from the same post list, so one new file shows up everywhere with no extra step." },
            ],
          },
        ],
      },
      code: [
        {
          file: "tools/blog/vite-plugin-blog.js",
          lang: "js",
          source: `const loaders = posts
  .map((p) => \`  \${JSON.stringify(p.meta.slug)}: () => import(\${JSON.stringify(POST_PREFIX + p.meta.slug)}),\`)
  .join("\\n");`,
        },
        {
          file: "index.html — runs before first paint",
          lang: "js",
          source: `var p = location.pathname.toLowerCase();
if (p !== "/blog" && p.indexOf("/blog/") !== 0) return;
var t = "light";
try { var s = localStorage.getItem("blog-theme"); if (s === "dark" || s === "light") t = s; } catch (e) {}
document.documentElement.setAttribute("data-theme", t);`,
        },
      ],
    },

    outcome: {
      body: [
        "Publishing is one file. Adding a Markdown file creates the article page, its entry on the blog index, its sitemap entry and its RSS item, with no code changes. Shared article links carry their own title, description and image instead of the site default.",
      ],
      gap: import.meta.env.DEV && "No measurements recorded yet: for example, the size of the blog index chunk with and without article bodies, or a link-preview check across platforms.",
    },

    lesson: {
      body: [
        "Sanitising is not a step you bolt on at the end. It interacts with every stage that generates ids. remark-rehype already prefixes footnote ids, and letting the sanitiser prefix them again broke every footnote link. The fix was to turn off the sanitiser's id prefix, which is only safe because raw HTML never reaches it: ids can only come from footnotes and heading slugs. I'd only relax a safety setting when I can say exactly why it's still safe.",
      ],
    },

    links: [
      { label: "The blog", to: "/blog" },
    ],
    sources: [
      { label: "tools/blog/vite-plugin-blog.js, content.js, markdown.js, static-output.js" },
      { label: "index.html (pre-paint theme script), src/blog/theme.js, BLOG_GUIDE.md" },
    ],
  },

  /* ======================================================================
     3. MahaKavach
  ====================================================================== */
  {
    slug: "crowd-signals-from-snapshots",
    status: "published",
    title: "Crowd safety signals from snapshots, not streams",
    dek: "Crowd conditions on a commuter platform change minute to minute, but safety systems tend to react after the fact. MahaKavach is an MVP that tries to surface risk early. These are the scoping decisions that made it buildable.",
    domain: "Real-time systems · Computer vision",
    year: "2025",
    role: "Builder",
    stack: ["YOLO", "FastAPI", "WebSockets", "React", "MapLibre GL", "PostgreSQL"],
    call: "Ship the end-to-end pipeline on image snapshots and transparent rules first, with the scoring step ready to take a trained model later.",
    headline: { value: "Signals, not alerts", label: "to avoid notification fatigue" },

    problem: {
      body: [
        "High-density transport lacks three things: real-time visibility into how crowded a platform is, indicators that predict risk before it peaks, and a structured way to report emergencies. In the project's own framing: crowd conditions change every minute, but safety systems react too late.",
      ],
    },

    constraints: {
      items: [
        "Built on free hosting tiers, which brings cold-start latency.",
        "Persistence on a free-tier managed PostgreSQL instance.",
        "No labelled crowd-risk data to train a scoring model on yet.",
        "The output is only as good as the input. Real-time accuracy depends on how fresh the data is.",
      ],
    },

    decision: {
      body: [
        "Build the whole path from camera input to dashboard first, and keep each layer decoupled so it can be upgraded on its own. Images go through YOLO people detection, counts are aggregated into a density level, a rule-based engine turns density plus context into a risk signal, and a FastAPI WebSocket server pushes state to a React dashboard.",
      ],
    },

    tradeoffs: {
      tradeoffs: [
        {
          chose: "Image snapshots as input",
          over: "Live video streaming",
          why: "Snapshots exercise the full detection-to-dashboard pipeline without the cost of continuous video.",
          cost: "Accuracy is bounded by how fresh the latest snapshot is.",
        },
        {
          chose: "Rule-based safety scoring, with an ML-ready interface",
          over: "Training a prediction model up front",
          why: "Rules combine time of day, live crowd intensity and station or line context in a way that can be inspected and explained.",
          cost: "Classification is rule-based for now. Prediction quality waits on a trained model.",
        },
        {
          chose: "Risk signals on a dashboard",
          over: "Push alerts",
          why: "To avoid notification fatigue for the people who would receive them.",
        },
        {
          chose: "In-memory live state, with a managed database for persistence",
          over: "Reading live state from the database",
          why: "The latest crowd state is held in memory and pushed to clients. The database keeps the record.",
          cost: "Running on free tiers adds cold-start latency.",
        },
      ],
    },

    implementation: {
      body: [
        "Density is mapped to three levels: green (low), yellow (moderate) and red (high congestion or saturation risk). Live state is pushed over native WebSockets, so the stateless frontend hydrates from the stream instead of polling. Pre-arrival estimates for a train use aggregated station context and historical arrival patterns.",
      ],
      diagram: {
        caption: "Select a stage to see what it does.",
        lanes: [
          {
            label: "Live path",
            nodes: [
              { id: "input", label: "Image input", detail: "Snapshots, or a dataset during development. There is deliberately no live video stream at this stage." },
              { id: "yolo", label: "YOLO detection", detail: "People detection on each image, producing counts for the next stage." },
              { id: "density", label: "Density level", detail: "Counts are aggregated into green, yellow or red." },
              { id: "rules", label: "Safety scoring", detail: "Rule-based. Combines time of day, live crowd intensity and station or line context into a risk signal. The interface is shaped so a trained model can replace the rules later." },
              { id: "ws", label: "FastAPI WebSocket", detail: "Pushes crowd state to every connected client as it changes." },
              { id: "ui", label: "React dashboard", detail: "A stateless React and MapLibre GL frontend that hydrates from the live stream and renders the heatmap." },
            ],
          },
          {
            label: "State",
            nodes: [
              { id: "mem", label: "In-memory state", detail: "Holds the latest crowd state for fast pushes to clients." },
              { id: "pg", label: "PostgreSQL", detail: "Managed PostgreSQL on a free tier, for persistence." },
            ],
          },
        ],
      },
    },

    outcome: {
      body: [
        "An MVP in active development. The work so far has gone into the WebSocket pipeline, heatmap rendering and validating that data flows end to end. ML-based crowd prediction, camera and IoT inputs, authority dashboards and an offline-first mobile experience are planned next.",
      ],
      gap: import.meta.env.DEV && "No measured results are published yet: no latency, throughput, detection accuracy or load-test figures. The figures on the Projects page (94% accuracy, 99.99% availability, 150+ stations) aren't supported by the repository and should not be quoted here until they're measured.",
    },

    lesson: {
      gap: import.meta.env.DEV && "Needs your own words. What did building the pipeline before the model teach you, and what would you do differently?",
    },

    links: [
      { label: "Projects page", to: "/projects" },
      { label: "Source on GitHub", href: "https://github.com/harshshah-2023/Mahakavach-realtime-crowd-safety" },
    ],
    sources: [
      { label: "Project README", href: "https://github.com/harshshah-2023/Mahakavach-realtime-crowd-safety" },
    ],
  },

  // Drafts: `import.meta.env.DEV` is a literal `false` in production builds,
  // so this whole block (and every note in it) is dropped from the bundle.
  ...(import.meta.env.DEV
    ? [
  /* ======================================================================
     4. Citadel Flow — draft: outcome figures conflict across the site
  ====================================================================== */
  {
    slug: "retrying-only-what-should-be-retried",
    status: "draft",
    title: "Retrying only the payments that should be retried",
    dek: "Most payment failures are recoverable, but a blind retry can charge twice or hammer a failing issuer. Citadel Flow models the payment lifecycle as a state machine so each retry is a deliberate decision.",
    domain: "Reliability · Payments",
    year: "2025",
    role: "Builder",
    stack: ["Node.js", "Express", "PostgreSQL", "Zod", "WebSockets", "React"],
    call: "A deterministic state machine for each payment, with retries chosen by failure type rather than a blanket retry count.",

    problem: {
      body: [
        "Transactions fail for many reasons, including issuer problems, network errors and timeouts, and most of those failures are recoverable. A gateway that doesn't retry intelligently loses revenue, and teams often can't see why payments failed in the first place.",
      ],
    },

    constraints: {
      items: [
        "Retries must never cause duplicate processing.",
        "This is a simulation. There is no real bank or card network, no money movement and no PCI scope.",
      ],
      gap: "Which constraints actually shaped the design? For example, latency budget or ordering guarantees.",
    },

    decision: {
      body: [
        "Model each payment as a deterministic state machine, classify every failure, and retry only when the failure type says a retry makes sense. Every attempt and every state event is recorded, so the system can explain itself.",
      ],
    },

    tradeoffs: {
      tradeoffs: [
        {
          chose: "Simulate the gateway",
          over: "Integrating a real payment provider",
          why: "Keeps the work on lifecycle and retry behaviour rather than provider onboarding.",
          cost: "No real card network behaviour, money movement or PCI handling. Authentication is UI-only by design.",
        },
      ],
      gap: "Which retry strategies were rejected (fixed count, uniform backoff?), and why? What does idempotency key on, and where is it stored?",
    },

    implementation: {
      body: [
        "Payments are stored with their status, failure code and attempt number. A separate event table records each event type, failure code, latency in milliseconds and JSON metadata, which feeds a live dashboard over WebSockets showing success rate, failure distribution and latency trends. Requests are validated with Zod.",
      ],
      gap: "List the states and transitions, and the failure taxonomy that decides retry or no retry.",
    },

    outcome: {
      gap: "Conflicting figures: the Projects page says a 92% recovery rate and 27% fewer redundant retries, while the old Resume page said a 25% increase in recovery. The README reports no measurements. Measure once, describe the method, then publish.",
    },

    lesson: { gap: "Needs your own words." },

    links: [
      { label: "Source on GitHub", href: "https://github.com/harshshah-2023/checkout-optimization-engine" },
    ],
    sources: [
      { label: "Project README", href: "https://github.com/harshshah-2023/checkout-optimization-engine" },
    ],
  },

  /* ======================================================================
     5. Field Operations Management System — draft: needs owner input
  ====================================================================== */
  {
    slug: "field-operations-from-prd-to-production",
    status: "draft",
    title: "Owning a field operations platform from PRD to production",
    dek: "As a Jr. Product Engineer at Autoplant System, I own a Field Operations Management System end to end, from requirements and architecture through implementation and release.",
    domain: "Product engineering",
    year: "2026",
    role: "Jr. Product Engineer · end-to-end owner",
    stack: [],
    call: "",

    problem: {
      body: [
        "Business and field requirements for multi-site field operations needed to become a product: requirement documents, a technical architecture, and a delivery plan the build could run on.",
      ],
      gap: "What specifically wasn't working before this system, and for whom? Describe it at a level that's safe to publish.",
    },
    constraints: {
      gap: "Scale, devices, connectivity, team size, deadlines. Keep it to what's safe to publish, with no customer names or internal data.",
    },
    decision: {
      body: [
        "The design work covered service boundaries, data models, integration contracts and operational workflows.",
      ],
      gap: "Which architectural choice mattered most, and why? Candidates you mentioned: GPS visualisation for many devices, scheduling and dispatch, telemetry-driven hardware investigation, offline sync.",
    },
    tradeoffs: { gap: "What did you reject, and what did the chosen approach cost?" },
    implementation: { gap: "A safe-to-publish diagram or code excerpt." },
    outcome: { gap: "Any outcome you can verify and are allowed to share." },
    lesson: { gap: "Needs your own words." },

    links: [{ label: "About", to: "/about" }],
    sources: [{ label: "Role description on the former Resume page and About page" }],
  },
      ]
    : []),
];

/** Drafts and content gaps exist only on the dev server, like blog drafts. */
export const SHOW_DRAFTS = import.meta.env.DEV;

export const stories = STORIES.filter((s) => SHOW_DRAFTS || s.status === "published");
export const publishedStories = stories.filter((s) => s.status === "published");
export const draftStories = stories.filter((s) => s.status === "draft");

export const getStory = (slug) => stories.find((s) => s.slug === slug);
export const storyUrl = (slug) => `/behind-the-build/${slug}`;

/** A section has something to show in this build. */
export const hasContent = (section) =>
  Boolean(
    section &&
      (section.body?.length ||
        section.items?.length ||
        section.tradeoffs?.length ||
        section.metrics?.length ||
        section.diagram ||
        section.code?.length)
  );

/** Sections rendered for a story: gaps are shown only alongside drafts. */
export const visibleSections = (story) =>
  SECTIONS.filter(({ key }) => hasContent(story[key]) || (SHOW_DRAFTS && story[key]?.gap));

export const gapCount = (story) => SECTIONS.filter(({ key }) => story[key]?.gap).length;
