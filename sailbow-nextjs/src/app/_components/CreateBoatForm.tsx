"use client"
import { Formik, Field } from "formik";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    VStack,
    Heading,
    Textarea
} from "@chakra-ui/react";
import { z } from "zod";
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useRouter } from "next/navigation";
import { createInsertSchema } from "drizzle-zod";
import { boatBanners, boats } from "@/db/schema";

const schema = createInsertSchema(boats)
    .omit({ id: true, captainUserId: true, createdOn: true })
    .extend({
        banner: createInsertSchema(boatBanners).omit({ boatId: true })
    })

type FormData = z.infer<typeof schema>

export default function CreateBoatForm() {
    const router = useRouter()

    const onSubmit = async (values: FormData) => {
        const result = await fetch("/api/dock", { method: "POST", body: JSON.stringify(values) })
        if (result.ok) {
            const json = await result.json()
            console.log(json)
            router.push(`/dock/${json["boatId"]}`)
        }
    }

    return (
        <Box bg="white" p={6} rounded="md" w={64} border="1px solid" borderColor="gray.100">
            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    banner: {
                        type: "url",
                        value: "",
                    }
                }}
                validationSchema={toFormikValidationSchema(schema)}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, errors, touched, handleChange }) => (
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="flex-start" outline="">
                            <Heading size="lg" color="teal.500">Create a Boat</Heading>
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
                            {/* <FormControl isInvalid={!!errors.color && touched.color}>
                            <FormLabel htmlFor="color">Color</FormLabel>
                            <Field
                                as={Input}
                                id="color"
                                name="color"
                                variant="filled"
                                onChange={handleChange("color")}
                            />
                            <FormErrorMessage>{errors.color}</FormErrorMessage>
                        </FormControl> */}
                            <Button type="submit" colorScheme="teal" width="full">
                                Save
                            </Button>
                        </VStack>
                    </form>
                )}
            </Formik>
        </Box>
    );
}