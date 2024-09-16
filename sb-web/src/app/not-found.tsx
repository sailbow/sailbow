import { Navbar } from "./_components/nav-bar";
import NotFoundPage from "./_components/not-found-page";

export default function NotFound() {
  return (
    <div className="relative h-dvh w-dvw">
      <Navbar />
      <div className="mt-navbar-height">
        <div className="pt-8">
          <NotFoundPage />
        </div>
      </div>
    </div>
  );
}
