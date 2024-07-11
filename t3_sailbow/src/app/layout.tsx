import "@/app/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { GlobalActiveBoatContext } from "@/hooks/use-boat";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <NextTopLoader color="hsl(var(--primary))" />
          <ClerkProvider
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
            <TRPCReactProvider>
              <GlobalActiveBoatContext>{children}</GlobalActiveBoatContext>
              <Toaster richColors={true} />
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
