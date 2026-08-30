/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ============================================================
         COLOR — cool-tinted neutrals instead of flat grays/blacks.
         `ink` carries a subtle blue-green cast so it sits in the same
         family as the brand accent; `mist` is the matching cool text
         ramp. `accent-500` is the existing brand colour, unchanged.
      ============================================================ */
      colors: {
        ink: {
          950: "#05080A", // deepest — page floor, hero wash
          900: "#080C0F", // page background
          850: "#0B1115", // alternating section background
          800: "#101A1F", // card surface
          750: "#152026", // raised surface / hover
          700: "#1B282F", // strong divider, inset field
        },
        mist: {
          50: "#F5F8F9", // headings
          100: "#E8EEF0",
          200: "#D3DDE1", // emphasised body
          300: "#B1C0C6", // body copy
          400: "#98A8AF", // secondary
          500: "#808F96", // captions / meta — >= 4.5:1 on every ink surface
          600: "#717F85", // muted footnotes — >= 4.5:1 on ink-900/950
        },
        accent: {
          200: "#A9D7DF",
          300: "#80C1CC",
          400: "#5DA4B1",
          500: "#468791", // rgb(70,135,145) — brand, unchanged
          600: "#3A717B",
          700: "#2D5961",
        },
      },

      /* ============================================================
         TYPOGRAPHY — line-height and tracking are attached to the
         existing scale, so every `text-*` already in the markup
         inherits the right rhythm: 1.5–1.6 for body, 1.05–1.25 for
         titles, with optical tracking tightening as size grows.
      ============================================================ */
      fontFamily: {
        sans: [
          "Inter", "ui-sans-serif", "system-ui", "-apple-system",
          "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.55" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.008em" }],
        "2xl": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.014em" }],
        "3xl": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.018em" }],
        "4xl": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.022em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.026em" }],
        "6xl": ["3.75rem", { lineHeight: "1.07", letterSpacing: "-0.03em" }],
        "7xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.034em" }],
      },
      // Measure caps for body copy: 60–75 characters per line.
      maxWidth: {
        measure: "68ch",
        "measure-sm": "58ch",
        "measure-lg": "75ch",
      },

      /* ============================================================
         ELEVATION — multi-layer, low-opacity shadows. A close contact
         shadow for the edge plus a wide, very soft ambient layer,
         instead of one heavy blur.
      ============================================================ */
      boxShadow: {
        e1: "0 1px 2px rgba(0,0,0,0.20), 0 1px 3px rgba(0,0,0,0.12)",
        e2: "0 1px 2px rgba(0,0,0,0.20), 0 6px 16px -6px rgba(0,0,0,0.28)",
        e3: "0 2px 4px rgba(0,0,0,0.22), 0 14px 34px -10px rgba(0,0,0,0.38)",
        e4: "0 4px 8px rgba(0,0,0,0.24), 0 28px 64px -16px rgba(0,0,0,0.48)",
        // Accent-tinted lift: a 1px ring reads as a crisp edge, the wide
        // layer as an ambient glow.
        glow: "0 0 0 1px rgba(70,135,145,0.26), 0 8px 26px -10px rgba(70,135,145,0.34)",
        "glow-lg": "0 0 0 1px rgba(70,135,145,0.34), 0 16px 44px -14px rgba(70,135,145,0.44)",
        // Top inner highlight — gives surfaces a lit edge.
        hairline: "inset 0 1px 0 rgba(255,255,255,0.05)",
      },

      /* Micro-interactions: 150–200ms, gentle deceleration. */
      transitionDuration: {
        DEFAULT: "180ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },

      animation: {
        'blob': 'blob 7s infinite',
        // Used by the mobile nav overlay; it was referenced but never defined,
        // so the menu appeared with no transition at all.
        'fadeIn': 'fadeIn 0.2s ease-out both',
        'riseIn': 'riseIn 0.24s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        }
      }
    },
  },
  plugins: [],
}
