"use client"
import { Formik, Field } from "formik";
import {
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    VStack, Textarea, useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useToast
} from "@chakra-ui/react";
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useRouter } from "next/navigation";
import { InferRequestType } from "@/contracts";
import { CreateBoatContract } from "@/contracts/dock"
import { api } from "@/trpc/react";

type FormData = InferRequestType<typeof CreateBoatContract>

export default function CreateBoatFlyoutForm() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter()
    const toast = useToast()

    // Option 2: trpc
    const { isLoading, mutate } = api.dock.createBoat.useMutation({
        onSuccess: (res) => {
            router.push(`/dock/${res.boatId}`)
        },
        onError: (error) => {
            toast({
                title: "Oops!",
                description: "Something went wrong, please try again later",
                status: "error",
                position: "top",
                isClosable: true
            })
        }
    })

    const onSubmit = (values: FormData) => {
        // Option 1: Invoke route handler manually with fetch
        // const result = await fetch("/api/dock", { method: "POST", body: JSON.stringify(values) })
        // if (result.ok) {
        //     const json = await result.json()
        //     router.push(`/dock/${json["boatId"]}`)
        // }

        // Option 2: trpc
        mutate(values)
    }

    const initialValues: FormData = {
        name: "",
        description: "",
        banner: {
            type: "url",
            value: "",
        }
    }

    return (
        <>
            <Button colorScheme='teal' onClick={onOpen}>
                Create Boat
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader color="teal.500">Create a Boat</DrawerHeader>
                    <DrawerBody>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={toFormikValidationSchema(CreateBoatContract.requestSchema)}
                            onSubmit={onSubmit}
                        >
                            {({ handleSubmit, errors, touched, handleChange }) => (
                                <form onSubmit={handleSubmit}>
                                    <VStack spacing={4} align="flex-start">
                                        <FormControl isInvalid={!!errors.name && touched.name}>
                                            <FormLabel htmlFor="name">Name</FormLabel>
                                            <Field
                                                as={Input}
                                                id="name"
                                                name="name"
                                                variant="filled"
                                                onChange={handleChange("name")}
                                            />
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>
                                        <FormControl isInvalid={!!errors.description && touched.description}>
                                            <FormLabel htmlFor="description">Description</FormLabel>
                                            <Field
                                                as={Textarea}
                                                id="description"
                                                name="description"
                                                variant="filled"
                                                onChange={handleChange("description")}
                                            />
                                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                                        </FormControl>
                                        <FormControl isInvalid={!!errors.banner?.value && touched?.banner?.value}>
                                            <FormLabel htmlFor="banner.value">Url</FormLabel>
                                            <Field
                                                as={Input}
                                                id="banner.value"
                                                name="banner.value"
                                                variant="filled"
                                                onChange={handleChange("banner.value")}
                                            />
                                            <FormErrorMessage>{errors.banner?.value}</FormErrorMessage>
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            colorScheme="teal"
                                            width="full"
                                            isLoading={isLoading}
                                        >
                                            Save
                                        </Button>
                                    </VStack>
                                </form>
                            )}
                        </Formik>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}