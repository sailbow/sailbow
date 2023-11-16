"use client"

import { BoatAndBanner } from "@/server/db/schema"
import { Box, Heading, Image, Text } from "@chakra-ui/react"

export default function BoatDetails({ boat }: { boat: BoatAndBanner }): JSX.Element {
    return (
        <Box p={3}>
            <Image src={boat.banner.value} alt={boat.name} mb="4" rounded="md" />
            <Heading fontSize="xl" mb="2">
                {boat.name}
            </Heading>
            <Text mb="6">{boat.description}</Text>
        </Box>
    )
}