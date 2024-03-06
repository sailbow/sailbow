import { Box } from "@chakra-ui/react";
import { NavBar } from "../_components";

export default function SignedInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <NavBar />
            <Box p={2} w="100%" h="100%">
                {children}
            </Box>
        </div>
    )
}