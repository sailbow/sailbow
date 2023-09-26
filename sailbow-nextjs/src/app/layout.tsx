import type { Metadata } from "next";
import { ClientProviders } from "./ClientProviders";
import ServerProviders from "./ServerProviders";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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
        <ServerProviders>
          <ClientProviders>
            <SignedIn>
              <NavBar />
              <Box p={4}>{children}</Box>
            </SignedIn>
            <SignedOut>
              <Box p={4}>{children}</Box>
            </SignedOut>
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  );
}
