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
        border: "#c3d5df",
        ring: "#36adf2",
        background: "hsl(202 100% 100%)",
        foreground: "hsl(202 5% 10%)",
        primary: {
          DEFAULT: "#36adf2",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#dee8ed",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#ef4343",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#eef6f4",
          foreground: "#61676b",
        },
        accent: {
          DEFAULT: "#deede9",
          foreground: "#242728",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#242728",
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
        "6xl": "clamp(4.77rem, 7.48vi + 2.9rem, 8.88rem)",
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
