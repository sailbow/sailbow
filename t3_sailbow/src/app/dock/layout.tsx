import { Navbar } from "../_components/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-dvw overflow-hidden bg-inherit">
      <Navbar />
      <main className="mt-navbar-height h-main-height w-full overflow-auto">
        {children}
      </main>
    </div>
  );
}
