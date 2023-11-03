"use client"
import { Link } from "@chakra-ui/next-js"
import { Button } from "@chakra-ui/react"

export default function GetStartedButton(): JSX.Element {
    return (
        <Link
            as={Button}
            href="/sign-in"
            bg="teal.500"
            color="white"
            fontWeight="bold"
            px={4}
            py={2}
            borderRadius="md"
            _hover={{ bg: "teal.600" }}
        >
            Get started
        </Link>
    )
}