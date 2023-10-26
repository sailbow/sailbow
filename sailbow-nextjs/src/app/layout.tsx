import type { Metadata } from "next";
import { ClientProviders } from "./ClientProviders";
import { ClerkProvider } from "@clerk/nextjs";

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
            {children}
          </ClientProviders>
        </body>
      </ClerkProvider>
    </html>
  );
}
