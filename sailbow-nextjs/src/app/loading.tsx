import { HelmSpinner } from "@/components";
import { Center } from "@chakra-ui/react";

export default function Loading() {
    return (
        <Center>
            <HelmSpinner size={100} />
        </Center>
    )
}