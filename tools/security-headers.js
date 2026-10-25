import { pathToFileURL } from "node:url";

/**
 * HTTP security headers for the static site - the single source for both
 * `vite preview` (vite.config.js) and the values pasted into Render
 * (Static Site -> Settings -> Headers, path `/*`). Print them with:
 *
 *   node tools/security-headers.js
 *
 * The CSP ships as *Report-Only*: violations are logged in the browser
 * console but nothing is blocked. Switch the header name to
 * `Content-Security-Policy` only after a clean run (see SECURITY_AUDIT.md).
 *
 * The two script hashes are the inline scripts in index.html (blog theme,
 * before first paint) and tools/blog/static-output.js (the "js" class on
 * prerendered pages). Editing either script changes its hash;
 * tests/build-output.test.js fails until these are updated. Hashes are of
 * the LF-normalised text, as browsers compute them (a Windows CRLF checkout
 * hashes differently on disk but not in the browser).
 */
const INLINE_SCRIPT_HASHES = [
  "'sha256-mCLIkIdJy2lOHYyhtVutZJz6PL6re9rowFn0m+W5GLw='", // index.html theme script
  "'sha256-qOhFsq0QMV2REqNwk5hGH5bZE9SkX6gt6yeyKdYPv+U='", // prerendered "js" class
];

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' ${INLINE_SCRIPT_HASHES.join(" ")}`,
  // framer-motion and the prerender <style> use inline styles.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  // Contact form (EmailJS REST API).
  "connect-src 'self' https://api.emailjs.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export const SECURITY_HEADERS = {
  "Content-Security-Policy-Report-Only": CONTENT_SECURITY_POLICY,
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) console.log(`${name}\n  ${value}\n`);
}
