"use client"
import { Link } from "@chakra-ui/next-js"
import { Button } from "@chakra-ui/react"

export default function ReturnHomeLinkButton(): JSX.Element {
    return (
        <Link
            as={Button}
            href="/dock"
            bg="teal.500"
            color="white"
            fontWeight="bold"
            px={4}
            py={2}
            borderRadius="md"
            _hover={{ bg: "teal.600" }}
        >
            Return Home
        </Link>
    )
}