"use client";

import { Navbar } from "../_components/nav-bar";
import Sidebar from "../_components/side-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-dvw bg-muted/40">
      <Navbar>
        <Sidebar />
      </Navbar>
      <main>{children}</main>
    </div>
  );
}
