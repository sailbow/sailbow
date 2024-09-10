import { type TailwindConfig } from "@react-email/components";

const TwConfig: TailwindConfig = {
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(202 30% 82%)",
        input: "hsl(202 30% 50%)",
        ring: "hsl(202 88% 58%)",
        background: "hsl(55 92% 98%)",
        foreground: "hsl(202 5% 10%)",
        primary: {
          DEFAULT: "hsl(173 80% 40%)",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(202 30% 90%)",
          foreground: "hsl(0 0% 0%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(202 5% 100%)",
        },
        muted: {
          DEFAULT: "hsl(240 4.8% 95.9%)",
          foreground: "hsl(240 3.8% 46.1%)",
        },
        accent: {
          DEFAULT: "hsl(203 89% 85%)",
          foreground: "hsl(202 5% 15%)",
        },
        card: {
          DEFAULT: "hsl(55 46% 98%)",
          foreground: "hsl(202 5% 15%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
};

export default TwConfig;
