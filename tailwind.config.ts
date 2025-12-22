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
        brand: {
          purple: {
            DEFAULT: "#685FFF",
            light: "#A4A1FF",
            dark: "#4d4dff",
            gradient: "linear-gradient(135deg, #685FFF 0%, #A4A1FF 100%)",
          },
          indigo: "#685FFF",
        },
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F4F4FB",
          dark: "#0d162f",
        },
        text: {
          primary: "#1a1a2e",
          secondary: "#6b7280",
          muted: "#9ca3af",
          alternate: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans", "system-ui", "sans-serif"],
        mono: ["Inconsolata", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "medium": "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;

