import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#060a08",
          900: "#0b120f",
          850: "#0f1a15",
          800: "#15241e",
          700: "#1c3229",
          600: "#274539",
        },
        sage: {
          100: "#e9efe9",
          200: "#d3ded5",
          300: "#b5c7b9",
          400: "#8fa89b",
          500: "#6e8a7c",
          600: "#546e61",
        },
        moss: {
          400: "#5a7a67",
          500: "#446150",
          600: "#32493c",
          700: "#24372d",
        },
        earth: {
          300: "#ebd49d",
          400: "#dcbe77",
          500: "#c5a059",
          600: "#a2803e",
          700: "#7b5f2b",
        },
        ocean: {
          800: "#173330",
          700: "#234c47",
          600: "#2d5a52",
          500: "#3b7269",
        },
        sand: {
          50: "#fafbf9",
          100: "#f4f6f0",
          200: "#e8ede2",
          300: "#d4ded0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "radial-subtle": "radial-gradient(ellipse at top, rgba(45, 90, 82, 0.15), transparent 70%)",
        "radial-glow": "radial-gradient(circle at center, rgba(197, 160, 89, 0.12), transparent 60%)",
        "forest-mesh": "radial-gradient(at 10% 20%, rgba(28, 50, 41, 0.4) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(45, 90, 82, 0.25) 0px, transparent 50%)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "drift-slow": "drift 20s ease-in-out infinite alternate",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(15px, -15px) scale(1.02)" },
          "100%": { transform: "translate(-10px, 10px) scale(0.98)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
