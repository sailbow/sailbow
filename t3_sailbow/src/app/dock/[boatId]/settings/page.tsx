import DeleteBoat from "./delete-boat";

export default function Page() {
  return (
    <div className="size-full overflow-y-auto">
      <div className="space-y-2">
        <h1 className="text-xl leading-none tracking-tight sm:text-3xl">
          Settings
        </h1>
        <DeleteBoat />
      </div>
    </div>
  );
}
