import { Moon, Sun } from "lucide-react";
import { useBlogTheme } from "../../blog/theme";

/**
 * Light/dark switch for the blog. A real switch (role="switch"), so screen
 * readers announce it as "Dark mode, on/off" and Space/Enter toggle it.
 */
export default function ThemeSwitch({ className = "" }) {
  const [theme, setTheme] = useBlogTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={`relative inline-flex h-8 w-[60px] shrink-0 items-center rounded-full border border-edge/[0.12]
                  bg-edge/[0.05] px-1 transition hover:border-accent-500/50 ${className}`}
    >
      {/* Track icons: sun on the left, moon on the right. */}
      <Sun size={14} aria-hidden="true" className="absolute left-2 text-mist-500" />
      <Moon size={14} aria-hidden="true" className="absolute right-2 text-mist-500" />
      {/* Thumb */}
      <span
        aria-hidden="true"
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-ink-950
                    text-accent-400 shadow-e2 ring-1 ring-edge/[0.10] transition-transform duration-200 ease-soft ${
                      dark ? "translate-x-7" : "translate-x-0"
                    }`}
      >
        {dark ? <Moon size={13} /> : <Sun size={13} />}
      </span>
    </button>
  );
}
