import Image from "@/components/ui/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  useAuth,
} from "@clerk/react";
import { Spinner } from "../_components/spinner";
import { Link } from "react-router";
import { Navbar } from "../_components/nav-bar";
import Typewriter from "@/components/typewriter";
import dockIllustration from "../../../images/dock-illustration.png";

const landingPhrases = ["assemble your crew", "chart a course", "set sail"];

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="relative h-dvh w-dvw overflow-hidden">
      <Image
        className="-z-10"
        alt="Dock"
        src={dockIllustration}
        sizes="100vw"
        style={{
          objectFit: "cover",
        }}
        priority
        fill
      />
      <Navbar className="border-none bg-transparent" />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-8">
          <div className="text-center text-foreground">
            <Image
              src="/icon.svg"
              width="100"
              height="100"
              alt="Sailbow Logo"
              className="mb-8 inline-block"
            />

            <Typewriter
              phrases={landingPhrases}
            />
            <p className="mt-6 text-base leading-8 text-gray-600/90 sm:text-lg">
              The easiest way to plan your next group trip
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <ClerkLoading>
                <Spinner />
              </ClerkLoading>
              <ClerkLoaded>
                {isLoaded && isSignedIn && (
                  <Link
                    to="/trips"
                    className={buttonVariants({ size: "lg" })}
                  >
                    My trips
                    <ArrowRight className="ml-2 size-6" />
                  </Link>
                )}
                {isLoaded && !isSignedIn && (
                  <SignInButton forceRedirectUrl={"/trips"}>
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 size-6" />
                    </Button>
                  </SignInButton>
                )}
              </ClerkLoaded>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
