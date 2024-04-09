import { Spinner } from "../_components/spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-dvh min-w-dvw">
            <Spinner className="size-12" />
        </div>
    )
}