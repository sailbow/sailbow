"use client"
import { InferRequestType, InferResponseType } from '@/contracts'
import { SearchImagesContract } from '@/contracts/images'
import { api } from '@/trpc/react'
import { EditIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    IconButton,
    Input,
    Button,
    Image,
    Box,
    Flex,
    Grid,
    useDisclosure,
    Skeleton,
    Wrap,
    WrapItem,
    useBreakpoint,
    useBreakpointValue
} from '@chakra-ui/react'
import { useState } from 'react'

type ImageSearch = InferRequestType<typeof SearchImagesContract>
type Image = InferResponseType<typeof SearchImagesContract>[number]

export default function ImageSearchModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [query, setQuery] = useState("")
    const [selectedImage, setSelectedImage] = useState<Image | null>(null)
    const { data, isFetching, isSuccess, refetch } = api.images.search.useQuery(
        { query },
        {
            enabled: false, meta: { errorMessage: "Failed to search images, please try again later" }
        })

    function searchPhotos(e: any): void {
        e.preventDefault()
        query && refetch()
    }

    function handleSelectImage(image: Image | null) {
        setSelectedImage(image)
    }

    function saveImage() {
        // Save image
    }

    return (
        <>
            <IconButton icon={<EditIcon />} onClick={onOpen} aria-label="Edit image" />
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="5xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Search Photos</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex as="form" onSubmit={searchPhotos} align="center">
                            <FormControl maxW="700px">
                                <Input
                                    placeholder="Search photos"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </FormControl>
                            <Button isDisabled={!query} type="submit" colorScheme="teal" ml={2}>Search</Button>
                        </Flex>
                        {isFetching && (
                            <Wrap spacing="4" mt={4}>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <WrapItem key={index}>
                                        <Skeleton height="300px" width="300px" rounded="lg" />
                                    </WrapItem>
                                ))}
                            </Wrap>
                        )}
                        {isSuccess && !isFetching && (
                            <Wrap spacing="4" mt={4}>
                                {data?.map(image => (
                                    <WrapItem key={image.id}>
                                        <Image
                                            src={image.urls.regular}
                                            alt={image.alt_description}
                                            onClick={() => handleSelectImage(image)}
                                            border={selectedImage === image ? '5px solid teal' : 'none'}
                                            borderRadius="lg"
                                            cursor="pointer"
                                            objectFit="cover"
                                            width="300px"
                                            height="300px"
                                            fallback={<Skeleton w="300px" h="300px" />}
                                        />
                                    </WrapItem>
                                ))}
                            </Wrap>
                        )}
                    </ModalBody>
                    <ModalFooter justifyContent="flex-start">
                        <Button onClick={saveImage} disabled={!selectedImage}>
                            Use Image
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}