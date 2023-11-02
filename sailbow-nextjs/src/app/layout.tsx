import type { Metadata } from "next";
import { ClientProviders } from "./ClientProviders";
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";

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
        <TRPCReactProvider headers={headers()}>
          <body>
            <ClientProviders>
              {children}
            </ClientProviders>
          </body>
        </TRPCReactProvider>
      </ClerkProvider>
    </html>
  );
}
