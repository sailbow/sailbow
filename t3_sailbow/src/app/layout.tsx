import '@/app/styles/globals.css';
import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs'
import { Plus_Jakarta_Sans } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import { type Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sailbow",
  description: "Sailbow Web App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "h-screen w-screen font-sans antialiased bg-background",
        font.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider appearance={{
            layout: {
              shimmer: true,
            },
            userButton: {
              elements: {
                avatarImage: "border-primary border-3"
              }
            }
          }}>
            <TRPCReactProvider>
              {children}
              <Toaster />
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
