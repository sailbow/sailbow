import type { Metadata } from "next";
import { ClientProviders } from "./ClientProviders";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { NavBar } from "@/app/_components"

export const metadata: Metadata = {
  title: "Sailbow",
  description: "Sailbow Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <ClientProviders>
            <SignedIn>
              <NavBar />
            </SignedIn>
            {children}
          </ClientProviders>
        </body>
      </ClerkProvider>
    </html>
  );
}
