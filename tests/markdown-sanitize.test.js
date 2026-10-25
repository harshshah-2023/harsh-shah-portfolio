import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "../tools/blog/markdown.js";
import { PUBLIC_DIR, startTags, unsafeParts } from "./helpers.js";

// Hostile Markdown a post (or a malicious pull request) could contain.
const PAYLOADS = {
  rawScript: "<script>alert(1)</script>",
  imgOnerror: '<img src=x onerror="alert(1)">',
  inlineHtml: 'Hi <b onclick="alert(1)">x</b> <iframe src="//evil"></iframe>',
  svgRaw: '<svg onload="alert(1)"><circle/></svg>',
  htmlComment: "<!-- --><script>alert(1)</script>",
  styleTag: "<style>body{display:none}</style>",
  jsLink: "[a](javascript:alert(1))",
  jsLinkMixedCase: "[a](JaVaScRiPt:alert(1))",
  jsLinkEntity: "[a](&#106;avascript:alert(1))",
  jsLinkColonEntity: "[a](javascript&colon;alert(1))",
  jsLinkPercent: "[a](javascript%3Aalert(1))",
  jsLinkLeadingSpace: "[a]( javascript:alert(1))",
  vbscriptLink: "[a](vbscript:msgbox(1))",
  dataHtmlLink: "[a](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)",
  autolinkJs: "<javascript:alert(1)>",
  referenceLinkJs: "[a][r]\n\n[r]: javascript:alert(1)",
  imageJs: "![a](javascript:alert(1))",
  imageDataSvg: "![a](data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+)",
  linkTitleBreakout: '[a](https://x.com "t\\" onmouseover=\\"alert(1))',
  codeFenceLangBreakout: '```js" onmouseover="alert(1)\nx\n```',
  fencedHtml: "```html\n<script>alert(1)</script>\n```",
  inlineCodeHtml: "`<img src=x onerror=alert(1)>`",
  footnoteHtml: "x[^1]\n\n[^1]: <script>alert(1)</script> note",
  tableHtml: "| a |\n|---|\n| <img src=x onerror=alert(1)> |",
  headingHtml: "## Title <img src=x onerror=alert(1)>",
};

for (const [name, markdown] of Object.entries(PAYLOADS)) {
  test(`sanitises: ${name}`, async () => {
    const { html } = await renderMarkdown(markdown, { publicDir: PUBLIC_DIR });
    assert.deepEqual(unsafeParts(html), [], html);
  });
}

test("fenced and inline code keep markup as visible text", async () => {
  const { html } = await renderMarkdown("`<b>x</b>`\n\n```html\n<script>1</script>\n```", {});
  assert.match(html, /&#x3C;b>x&#x3C;\/b>/);
  assert.ok(!startTags(html).some((t) => t.name === "b" || t.name === "script"));
});

test("external links open safely, internal links do not get target", async () => {
  const { html } = await renderMarkdown("[ext](https://example.com) [int](/blog)", {});
  const [ext, int] = startTags(html).filter((t) => t.name === "a");
  assert.equal(ext.attrs.target, "_blank");
  assert.deepEqual(ext.attrs.rel.split(" ").sort(), ["noopener", "noreferrer"]);
  assert.equal(int.attrs.target, undefined);
});

test("backslash paths cannot become protocol-relative URLs", async () => {
  const { html } = await renderMarkdown("[a](/\\evil.com) [b](/\\\\evil.com)", {});
  for (const a of startTags(html).filter((t) => t.name === "a")) {
    assert.ok(!a.attrs.href.includes("\\"), a.attrs.href);
  }
});

test("local images keep intrinsic width/height", async () => {
  const { html } = await renderMarkdown("![d](/blog/images/rag-pipeline-diagram.svg)", { publicDir: PUBLIC_DIR });
  const img = startTags(html).find((t) => t.name === "img");
  assert.equal(img.attrs.width, "1200");
  assert.equal(img.attrs.height, "420");
});

test("image size lookups stay inside public/", async () => {
  // This file exists and is a real image, but outside public/.
  const { html } = await renderMarkdown("![x](/../src/assets/heroMain-800.webp)", { publicDir: PUBLIC_DIR });
  const img = startTags(html).find((t) => t.name === "img");
  assert.equal(img.attrs.width, undefined);
  assert.equal(img.attrs.height, undefined);
});

test("missing local images render without dimensions instead of failing", async () => {
  const { html } = await renderMarkdown("![x](/blog/images/does-not-exist.png)", { publicDir: PUBLIC_DIR });
  assert.equal(startTags(html).find((t) => t.name === "img").attrs.width, undefined);
});
