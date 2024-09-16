import React from "react";
import { Navbar } from "@/app/_components/nav-bar";
import ConvexAuthenticated from "./convex-authenticated";
import { ThemeProvider } from "next-themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="h-dvh w-dvw overflow-hidden bg-inherit">
        <Navbar />
        <main className="fixed top-navbar-height h-main-height w-full overflow-auto">
          <ConvexAuthenticated>{children}</ConvexAuthenticated>
        </main>
      </div>
    </ThemeProvider>
  );
}
