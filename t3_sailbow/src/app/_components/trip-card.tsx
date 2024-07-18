import { type Boat } from "@/lib/schemas/boat";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ImageWithLoader from "./image-with-loader";
import { type Route } from "next";
import { Button } from "@/components/ui/button";
import { Sailboat } from "lucide-react";
import { Doc } from "@convex/_generated/dataModel";

const TripCard = ({ trip }: { trip: Doc<"trips"> }) => {
  let banner;
  if (!trip.banner) {
    banner = (
      <div className="flex size-full items-center justify-center bg-gradient-to-r from-accent via-muted to-accent">
        <Sailboat className="size-32 stroke-muted-foreground" strokeWidth={1} />
      </div>
    );
  } else {
    banner = (
      <ImageWithLoader
        src={trip.banner.small}
        alt={trip.name + " image"}
        className="rounded-b-none"
      />
    );
  }

  return (
    <Card
      className="
      h-[250px] overflow-hidden transition-transform duration-300
      ease-in-out focus-within:scale-105 focus-within:transform
      focus-within:border-ring hover:scale-105 hover:transform hover:border-2 hover:border-ring"
    >
      <Link className="flex size-full flex-col" href={`/dock/${trip._id}`}>
        <CardContent className="relative basis-3/4 p-0">{banner}</CardContent>
        <div className="flex basis-1/4 items-center">
          <div className="flex items-center justify-center p-4">
            <CardTitle className="text-lg font-normal">{trip.name}</CardTitle>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default TripCard;
