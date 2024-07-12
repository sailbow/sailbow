import { CreateBoatForm } from "@/app/_components/create-boat-form";
import { type Viewport } from "next/types";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};
export default function NewBoatPage() {
  return (
    <div className="container mx-auto h-full max-w-2xl py-4">
      <CreateBoatForm />
    </div>
  );
}
