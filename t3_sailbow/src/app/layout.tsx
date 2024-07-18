import "@/app/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { GlobalActiveTripContext } from "@/hooks/use-boat";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata, type Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ConvexClientProvider } from "@/ConvexProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@/env";

const font = Plus_Jakarta_Sans({
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
              <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />

              <TRPCReactProvider>
                <GlobalActiveTripContext>{children}</GlobalActiveTripContext>
                <Toaster richColors={true} />
              </TRPCReactProvider>
            </ThemeProvider>
          </body>
        </ConvexClientProvider>
      </ClerkProvider>
    </html>
  );
}
