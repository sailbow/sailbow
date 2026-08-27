import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/poppins/500.css";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ConvexClientProvider } from "./ConvexProvider";
import { ThemeProvider } from "./components/theme-provider";
import App from "./App";
import { env } from "./env";
import "./app/globals.css";

const publishableKey = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <ConvexClientProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <BrowserRouter>
            <NuqsAdapter>
              <App />
            </NuqsAdapter>
          </BrowserRouter>
        </ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  </React.StrictMode>,
);