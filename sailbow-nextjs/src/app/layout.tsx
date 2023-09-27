import type { Metadata } from "next";
import { ClientProviders } from "./ClientProviders";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import NavBar from "./_components/NavBar";
import { Box } from "@chakra-ui/react";

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
      <body>
        <ClientProviders>
          <ClerkProvider>
            <SignedIn>
              <NavBar />
              <Box p={4}>{children}</Box>
            </SignedIn>
            <SignedOut>{children}</SignedOut>
          </ClerkProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
