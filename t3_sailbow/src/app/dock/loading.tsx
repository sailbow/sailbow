import { Spinner } from "../_components/spinner";

export default function Loading() {
    return (
        <div className="flex w-full items-center justify-center p-4">
            <Spinner className="size-8" />
        </div>
    )
}