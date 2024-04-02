import Link from "next/link"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="border-b py-4 bg-slate-100">
      <div className="flex items-center container mx-auto justify-between">
        <div className="flex gap-10 items-center text-xl">
          <Link href="/" className="flex gap-2 items-center text-xl">
            <Image
              src="/logo.png"
              alt="Sailbow Logo"
              height={30}
              width={30}
            />
          </Link>
        </div>
        <UserButton />
      </div>
    </div>
  )
}

