import { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeSwitch from "./Blog/ThemeSwitch";
import { isBlogPath } from "../blog/theme";

const NAV_ITEMS = [
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
  { label: "Behind the Build", to: "/behind-the-build" },
  { label: "Blog", to: "/blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer on navigation. Relying only on each link's onClick meant
  // the overlay stayed open on back/forward navigation.
  useEffect(() => setOpen(false), [pathname]);

  // The overlay is fixed and full-screen; without this the page behind it
  // still scrolls under the menu.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Nested routes (/blog/:slug) keep their section highlighted.
  const isActive = (to) => {
    const path = pathname.toLowerCase();
    return path === to || path.startsWith(`${to}/`);
  };

  // The light/dark switch belongs to the blog section only.
  const onBlog = isBlogPath(pathname.toLowerCase());

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <nav
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between
                   py-4 px-6 lg:px-8 backdrop-blur-xl bg-ink-950/70
                   border-b border-edge/[0.06]"
      >
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="rounded-lg text-3xl font-serif text-mist-50 transition-colors
                     hover:text-mist-100"
        >
          Harsh<span className="text-accent-500">shah</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-base font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(item.to) ? "page" : undefined}
              className={`relative py-2 transition-colors ${
                isActive(item.to)
                  ? "text-accent-400"
                  : "text-mist-300 hover:text-mist-50"
              }`}
            >
              {item.label}
              {/* Active indicator: a hairline rule rather than colour alone. */}
              <span
                aria-hidden="true"
                className={`absolute left-0 -bottom-px h-px w-full rounded-full
                            bg-accent-500 transition-opacity duration-200 ${
                              isActive(item.to) ? "opacity-100" : "opacity-0"
                            }`}
              />
            </Link>
          ))}
          {onBlog && <ThemeSwitch className="-my-1" />}
        </div>

        {/* MOBILE: theme switch (blog only) + menu icon */}
        <div className="md:hidden flex items-center gap-3">
          {onBlog && <ThemeSwitch />}
          <button
            type="button"
            className="-mr-2 p-2 rounded-lg text-mist-200 transition
                       hover:bg-edge/[0.06] hover:text-mist-50 active:scale-95"
            aria-label="Open navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={28} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ================= FULLSCREEN MOBILE NAV ================= */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center
                     bg-ink-950/95 backdrop-blur-xl animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-4 right-6 p-2 rounded-lg text-mist-400 transition
                       hover:bg-edge/[0.06] hover:text-accent-400 active:scale-95"
          >
            <X size={28} aria-hidden="true" />
          </button>

          <div className="flex flex-col items-center gap-6 animate-riseIn">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.to) ? "page" : undefined}
                className={`px-4 py-2 rounded-lg text-2xl font-light tracking-tight
                            transition hover:-translate-y-0.5 ${
                              isActive(item.to)
                                ? "text-accent-400"
                                : "text-mist-200 hover:text-accent-300"
                            }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center rounded-lg border border-accent-500/60
                         px-8 py-3 text-base font-medium text-mist-100 shadow-glow
                         transition duration-200 ease-soft
                         hover:-translate-y-0.5 hover:bg-accent-500 hover:text-ink-950
                         hover:shadow-glow-lg"
            >
              Let&apos;s Connect 🚀
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
