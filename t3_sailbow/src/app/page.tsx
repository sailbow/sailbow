import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function Home() {
  noStore();

  return (
    <div className="h-screen bg-gradient-to-r from-pink-100 to-teal-100">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-8">
          <div className="text-center text-foreground">
            <Image
              src="/icon.svg"
              width="100"
              height="100"
              alt="Sailbow Logo"
              className="inline-block mb-8"
            />

            <div className="text-gray-600 text-3xl font-bold tracking-tight leading-none">
              assemble your crew.<br />chart a course.<br />set sail.
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-600/90">
              The easiest way to plan your next group trip
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dock"
              >
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
