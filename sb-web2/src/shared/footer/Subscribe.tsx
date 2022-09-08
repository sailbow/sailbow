import React, { ChangeEvent, FunctionComponent, useState } from 'react';

import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Text,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Tooltip,
    FormControl,
} from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { showSuccessToast } from 'shared/toast/Toast';
// import { SbMailIcon, SbErrorCircleIcon } from 'shared/icons/Icons';

interface FormValues {
    email: string;
}

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
});

export const Subscribe: FunctionComponent = () => {
    const [emailForm, setEmailForm] = useState<FormValues>({ email: '' });

    const onSubmit = () => {
        showSuccessToast('Added to the subscription list!');
    };

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailForm({
            ...emailForm,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Box>
            <Heading size="sm" textTransform="uppercase" letterSpacing="wider" color="gray.400">
                Subscribe to our newsletter
            </Heading>
            <Flex textAlign="start" flexDir="column" pt="4">
                <Text fontWeight="normal" fontSize="sm">
                    Get notified when we have exciting news for you.
                </Text>
                <Formik initialValues={emailForm} onSubmit={onSubmit} validationSchema={FormSchema}>
                    {({ errors, touched, getFieldProps }: FormikProps<FormValues>) => (
                        <Form>
                            <Flex alignItems="center" mt="2">
                                <FormControl isInvalid={Boolean(errors.email && touched.email)} onChange={setForm}>
                                    <InputGroup variant="brand" size="sm">
                                        <InputLeftAddon position="absolute" p="0">
                                            {/* <SbMailIcon /> */}
                                        </InputLeftAddon>
                                        <Input
                                            {...getFieldProps('email')}
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email *"
                                            className="contact-input"
                                            paddingLeft="24px"
                                        />
                                        {errors.email && touched.email ? (
                                            <Tooltip label="Please enter a valid email address!">
                                                <InputRightElement color="brand.error">
                                                    {/* <SbErrorCircleIcon /> */}
                                                </InputRightElement>
                                            </Tooltip>
                                        ) : null}
                                    </InputGroup>
                                </FormControl>
                                <Button size="sm" px="6" colorScheme="gray" ml="2" type="submit">
                                    Subscribe
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Flex>
        </Box>
    );
};
