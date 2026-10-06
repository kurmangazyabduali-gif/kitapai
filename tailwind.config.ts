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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Kid-friendly palette
        edu: {
          sky: {
            50: "#F0F9FF",
            100: "#E0F2FE",
            200: "#BAE6FD",
            300: "#7DD3FC",
            400: "#38BDF8",
            500: "#0EA5E9",
            600: "#0284C7",
            700: "#0369A1",
          },
          yellow: {
            50: "#FEFCE8",
            100: "#FEF9C3",
            200: "#FEF08A",
            300: "#FDE047",
            400: "#FACC15",
            500: "#EAB308",
            600: "#CA8A04",
            700: "#A16207",
            800: "#854D0E",
            900: "#713F12",
          },
          green: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            200: "#BBF7D0",
            300: "#86EFAC",
            400: "#4ADE80",
            500: "#22C55E",
            600: "#16A34A",
            700: "#15803D",
          },
          purple: {
            50: "#FAF5FF",
            100: "#F3E8FF",
            200: "#E9D5FF",
            300: "#D8B4FE",
            400: "#C084FC",
            500: "#A855F7",
            600: "#9333EA",
            700: "#7E22CE",
          },
          coral: {
            50: "#FFF1F2",
            100: "#FFE4E6",
            200: "#FECDD3",
            300: "#FDA4AF",
            400: "#FB7185",
            500: "#F43F5E",
            600: "#E11D48",
          },
          cream: "#FFFDF7",
          cloud: "#F8FAFC",
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      boxShadow: {
        "kid-sm": "0 2px 0 0 rgba(0,0,0,0.06), 0 4px 12px 0 rgba(0,0,0,0.04)",
        "kid-md": "0 4px 0 0 rgba(0,0,0,0.08), 0 8px 20px 0 rgba(0,0,0,0.06)",
        "kid-lg": "0 6px 0 0 rgba(0,0,0,0.1), 0 16px 30px -4px rgba(0,0,0,0.08)",
        "kid-sky": "0 6px 0 0 #0284C7, 0 12px 24px -4px rgba(14, 165, 233, 0.35)",
        "kid-yellow": "0 6px 0 0 #CA8A04, 0 12px 24px -4px rgba(234, 179, 8, 0.35)",
        "kid-green": "0 6px 0 0 #15803D, 0 12px 24px -4px rgba(34, 197, 94, 0.35)",
        "kid-purple": "0 6px 0 0 #7E22CE, 0 12px 24px -4px rgba(168, 85, 247, 0.35)",
        "kid-coral": "0 6px 0 0 #BE123C, 0 12px 24px -4px rgba(244, 63, 94, 0.35)",
        "soft-float": "0 20px 40px -15px rgba(0,0,0,0.07)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.05)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
