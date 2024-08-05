import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto mt-8">
      <div className="flex w-full flex-col items-center space-y-4">
        <h1 className="text-4xl font-light">404 Not Found</h1>
        <Button variant="outline" size="lg" className="mt-4" asChild>
          <Link href="/trips">Back to my trips</Link>
        </Button>
      </div>
    </div>
  );
}
