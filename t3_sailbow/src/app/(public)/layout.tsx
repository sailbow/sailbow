import { Navbar } from "../_components/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-dvw bg-inherit">
      <Navbar />
      <main className="mt-navbar-height">{children}</main>
    </div>
  );
}
