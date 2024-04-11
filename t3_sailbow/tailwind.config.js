/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultConfig')
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.theme.screens,
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        sm: "clamp(0.8rem, 0.17vi + 0.76rem, 0.89rem)",
        base: "clamp(1rem, 0.34vi + 0.91rem, 1.19rem)",
        lg: "clamp(1.25rem, 0.61vi + 1.1rem, 1.58rem)",
        xl: "clamp(1.56rem, 1vi + 1.31rem, 2.11rem)",
        "2xl": "clamp(1.95rem, 1.56vi + 1.56rem, 2.81rem)",
        "3xl": "clamp(2.44rem, 2.38vi + 1.85rem, 3.75rem)",
        "4xl": "clamp(3.05rem, 3.54vi + 2.17rem, 5rem)",
        "5xl": "clamp(3.81rem, 5.18vi + 2.52rem, 6.66rem)",
        "6xl": "clamp(4.77rem, 7.48vi + 2.9rem, 8.88rem)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}