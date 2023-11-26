"use client"
import { BoatAndBanner } from "@/server/db/schema"
import { Box, Button, Heading, Image, Text, VStack, useToast } from "@chakra-ui/react"
import { api } from "@/trpc/react"
import { HelmSpinner } from "@/components"
import { useRouter } from "next/navigation"

export default function BoatDetails({ boat }: { boat: BoatAndBanner }): JSX.Element {
    const router = useRouter()
    const toast = useToast()
    const { isLoading: isDeleteBoatByIdLoading, mutate: deleteBoatById } = api.dock.deleteBoatById.useMutation({
        onSuccess: () => {
            router.push('/dock')
        },
        onError: () => {
            toast({
                title: "Oops!",
                description: "Something went wrong, please try again later",
                status: "error",
                position: "top",
                isClosable: true
            })
        }
    })
    return (
        <Box p={3}>
            <Image src={boat.banner.value} alt={boat.name} rounded="md" />
            <Heading fontSize="4xl" mt={2}>
                {boat.name}
            </Heading>
            <Text mt={2}>{boat.description}</Text>
            <Button mt={10}
                colorScheme="red"
                variant="outline"
                spinner={<HelmSpinner />}
                loadingText="Deleting boat..."
                isLoading={isDeleteBoatByIdLoading}
                onClick={() => deleteBoatById({ boatId: boat.id })}
            >
                Delete this boat
            </Button>
        </Box>
    )
}