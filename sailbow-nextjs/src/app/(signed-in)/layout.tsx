import { Box } from "@chakra-ui/react";
import { NavBar } from "../_components";

export default function SignedInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box p={2}>
            {children}
        </Box>
    )
}