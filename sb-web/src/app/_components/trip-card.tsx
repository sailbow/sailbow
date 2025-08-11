import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { type Doc } from "@convex/_generated/dataModel";
import { Sailboat, Users } from "lucide-react";
import Link from "next/link";
import ImageWithLoader from "./image-with-loader";

const TripCard = ({ trip }: { trip: Doc<"trips"> & { crewCount: number } }) => {
  let banner;
  if (!trip.banner) {
    banner = (
      <div className="flex size-full items-center justify-center bg-gradient-to-r from-primary/30 via-muted to-primary/30">
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
      <Link className="flex size-full flex-col" href={`/trips/${trip._id}`}>
        <CardContent className="relative flex basis-3/4 p-0">
          {banner}
        </CardContent>
        <div className="flex basis-1/4 items-center">
          <div className="flex w-full items-center gap-4 p-4">
            <CardTitle className="line-clamp-2 text-clip text-lg font-normal">
              {trip.name}
            </CardTitle>
            <div className="ml-auto inline-flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 size-5 text-muted-foreground" />
              {trip.crewCount}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default TripCard;
