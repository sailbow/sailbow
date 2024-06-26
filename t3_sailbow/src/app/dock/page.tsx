import BoatCard from "../_components/boat-card";
import { api } from "@/trpc/server";
import CreateBoatButton from "./create-boat-button";
import ErrorPage from "../_components/error-page";

export default async function Page() {
  let boats;
  try {
    boats = await api.dock.getBoats.query();
  } catch (err) {
    console.error(err);
    return <ErrorPage />;
  }

  return (
    <div className="relative size-full overflow-y-auto bg-inherit">
      <div className="container sticky top-0 z-10 flex items-center justify-between bg-background p-4">
        <div className="text-xl font-medium">Boats</div>
        <CreateBoatButton />
      </div>
      <div className="mx-auto grid w-full grid-cols-1 gap-6 overflow-hidden p-4 px-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boats.map((boat) => {
          return <BoatCard key={boat.id} boat={boat} />;
        })}
      </div>
    </div>
  );
}
