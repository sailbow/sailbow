import { Box } from "@chakra-ui/react";
export default function DockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box p={2}>
      {children}
    </Box>
  );
}
