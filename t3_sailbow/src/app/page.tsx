import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  return (
    <div className="h-screen bg-gradient-to-b from-primary/95 to-teal-100">
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

            <h1 className="text-2xl font-bold leading-none tracking-tight text-gray-600 sm:text-6xl">
              assemble your crew.
              <br />
              chart a course.
              <br />
              set sail.
            </h1>
            <p className="mt-6 text-base leading-8 text-gray-600/90 sm:text-lg">
              The easiest way to plan your next group trip
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dock">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 size-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
