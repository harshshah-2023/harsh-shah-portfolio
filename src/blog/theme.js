import { useEffect, useSyncExternalStore } from "react";

/**
 * Light/dark theme for the blog section. Light is the default; the reader's
 * choice is remembered per browser. Outside /blog the site stays dark.
 *
 * The same storage key and default are read by the inline script in
 * index.html, which sets data-theme before first paint so a blog page never
 * flashes dark before React mounts. Keep the two in sync.
 */

export const THEME_KEY = "blog-theme";
const DEFAULT_THEME = "light";

// Matches --ink-900 in each palette (browser UI / mobile address bar colour).
const THEME_COLOR = { light: "#FBFBF9", dark: "#080C0F" };

const listeners = new Set();

function read() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" || saved === "light" ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

let current = typeof window === "undefined" ? DEFAULT_THEME : read();

export function setBlogTheme(theme) {
  current = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function useBlogTheme() {
  const theme = useSyncExternalStore(subscribe, () => current, () => DEFAULT_THEME);
  return [theme, setBlogTheme];
}

export const isBlogPath = (pathname) => pathname === "/blog" || pathname.startsWith("/blog/");

/** Applies the blog theme to <html> while on a blog route, dark elsewhere. */
export function useApplyBlogTheme(pathname) {
  const [theme] = useBlogTheme();
  const onBlog = isBlogPath(pathname.toLowerCase());

  useEffect(() => {
    const root = document.documentElement;
    const active = onBlog ? theme : "dark";
    if (onBlog) root.dataset.theme = theme;
    else delete root.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[active]);
  }, [onBlog, theme]);
}
