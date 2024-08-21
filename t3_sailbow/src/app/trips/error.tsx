"use client";

import { SbError } from "@convex/errorUtils";
import NotFoundPage from "../_components/not-found-page";

export default function Error({ error }: { error: SbError }) {
  if (error instanceof SbError && error.data.code === "NOT_FOUND") {
    return <NotFoundPage />;
  }
  return (
    <div className="container mx-auto p-8">
      <div className="flex w-full justify-center">
        <h1 className="text-2xl font-bold">
          Something went wrong on this page! Please check back again later
        </h1>
      </div>
    </div>
  );
}
