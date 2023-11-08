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
        <body>
          <ClientProviders>
            <TRPCReactProvider headers={headers()}>
              {children}
            </TRPCReactProvider>
          </ClientProviders>
        </body>
      </ClerkProvider>
    </html >
  );
}
