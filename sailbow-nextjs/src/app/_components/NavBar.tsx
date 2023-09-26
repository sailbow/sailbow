"use client";
import { Box, Flex, HStack, useColorModeValue, Image } from "@chakra-ui/react";
import ProfileBadge from "./ProfileBadge";
import { Link } from "@chakra-ui/next-js";

interface Props {
  children: React.ReactNode;
  path: string;
}

const Links = [
  // {
  //   name: "Home",
  //   path: "/",
  // },
  {
    name: "Boats",
    path: "/boats",
  },
];

const NavLink = (props: Props) => {
  const { children, path } = props;

  return (
    <Link
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      href={path}
      _hover={{
        textDecoration: "none",
        bg: "gray.300",
      }}
    >
      {children}
    </Link>
  );
};

export default function NavBar() {
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={5}
        >
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Link href="/">
                <Image
                  width="40px"
                  height="40px"
                  src="./sailbow.svg"
                  alt="Sailbow logo"
                />
              </Link>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.name} path={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <ProfileBadge />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
