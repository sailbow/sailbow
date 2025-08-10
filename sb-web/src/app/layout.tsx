export const dynamic = "force-dynamic";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { type Metadata, type Viewport } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ConvexClientProvider } from "@/ConvexProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@/env";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const font = Poppins({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sailbow",
  description: "Sailbow Web App",
  icons: {
    icon: "/sailbow.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider
        publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        signInUrl={env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
        signUpUrl={env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        signInFallbackRedirectUrl={
          env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
        }
        signUpFallbackRedirectUrl={
          env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
        }
        appearance={{
          layout: {
            shimmer: true,
          },
          userButton: {
            elements: {
              avatarImage: "border-primary border-3",
            },
          },
        }}
      >
        <ConvexClientProvider>
          <body
            className={cn(
              "h-screen w-screen bg-background font-sans antialiased",
              font.variable,
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NuqsAdapter>
                <NextTopLoader
                  color="hsl(var(--primary))"
                  showSpinner={false}
                />
                {children}
              </NuqsAdapter>
            </ThemeProvider>
          </body>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="top-right"
          />
        </ConvexClientProvider>
      </ClerkProvider>
    </html>
  );
}
