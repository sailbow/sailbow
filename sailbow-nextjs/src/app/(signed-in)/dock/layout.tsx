import { Box } from "@chakra-ui/react";
export default function DockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Box borderWidth="1px" borderRadius="lg" textAlign="center">
        Shared on /dock/* routes
      </Box>
      <Box p={2}>
        {children}
      </Box>
    </section>
  );
}
