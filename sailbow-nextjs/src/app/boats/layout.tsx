import { Box } from "@chakra-ui/react";
export default function BoatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Box borderWidth="1px" borderRadius="lg" textAlign="center">
        Shared on /boats/* routes
      </Box>
      {children}
    </section>
  );
}
