import { HelmSpinner } from "@/components";
import { AbsoluteCenter } from "@chakra-ui/react";

export default function Loading() {
    return (
        <AbsoluteCenter h={300}>
            <HelmSpinner size={100} />
        </AbsoluteCenter>
    )
}