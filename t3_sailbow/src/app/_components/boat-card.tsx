import { type Boat } from "@/lib/schemas/boat";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ImageWithLoader from "./image-with-loader";

const BoatCard = ({ boat }: { boat: Boat }) => {
  let banner;
  if (boat.bannerType === "color") {
    banner = (
      <div
        style={{ backgroundColor: boat.bannerValue }}
        className="h-full w-full"
      />
    );
  } else {
    banner = (
      <ImageWithLoader
        src={boat.bannerValue}
        alt={boat.name + " image"}
        className="rounded-b-none"
      />
    );
  }
  return (
    <Card
      className="
      h-[250px] overflow-hidden transition-transform duration-300 ease-in-out
      focus-within:scale-105 focus-within:transform focus-within:border-2 focus-within:border-ring
      hover:scale-105 hover:transform hover:border-2 hover:border-ring"
    >
      <Link className="flex size-full flex-col" href={`/dock/${boat.id}`}>
        <CardContent className="relative basis-3/4 p-0">{banner}</CardContent>
        <div className="flex basis-1/4 items-center">
          <div className="flex items-center justify-center p-4">
            <CardTitle className="text-lg font-normal">{boat.name}</CardTitle>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BoatCard;
