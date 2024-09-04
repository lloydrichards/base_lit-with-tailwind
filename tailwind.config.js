/** @type {import('tailwindcss').Config} */
export default {
  content: ["lib/**/*.{ts,html,css,scss}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--_border))",
        input: "hsl(var(--_input))",
        ring: "hsl(var(--_ring))",
        background: "hsl(var(--_background))",
        foreground: "hsl(var(--_foreground))",
        primary: {
          DEFAULT: "hsl(var(--_primary))",
          foreground: "hsl(var(--_primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--_secondary))",
          foreground: "hsl(var(--_secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--_destructive))",
          foreground: "hsl(var(--_destructive-foreground))",
        },
      },
    },
  },
  plugins: [],
};
