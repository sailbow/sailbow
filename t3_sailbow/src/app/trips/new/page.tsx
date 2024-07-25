"use client";
import { CreateTripForm } from "@/app/_components/create-boat-form";
import { Authenticated } from "convex/react";

export default function NewBoatPage() {
  return (
    <div className="container mx-auto h-full max-w-2xl py-4">
      <CreateTripForm />
    </div>
  );
}
