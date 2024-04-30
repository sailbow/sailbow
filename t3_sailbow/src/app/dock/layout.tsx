import { Navbar } from "../_components/nav-bar";
import Sidebar from "../_components/side-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-dvw overflow-hidden bg-muted/40">
      <Navbar>
        <Sidebar />
      </Navbar>
      <main className="mt-navbar-height h-main-height w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
