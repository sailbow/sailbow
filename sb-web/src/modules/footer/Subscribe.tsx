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
import { Form, Formik, Field } from 'formik';

import { ToastActionType, useToast } from 'contexts/toast/Toast';
import { Envelope, ErrorCircle } from 'util/Icons';
import { validateEmail } from 'util/Utils';

export const Subscribe: FunctionComponent = () => {
    const [, dispatch] = useToast();
    const [emailForm, setEmailForm] = useState<{ email: string }>({ email: '' });

    const onSubmit = () => {
        dispatch({ type: ToastActionType.ShowSuccess, text: 'Added to the subscription list!' });
        console.log(emailForm);
    };

    const emailValidation = (value: string) => {
        if (value) return !validateEmail(value);
        return true;
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
                <Text fontWeight="normal">Get notified when we have exciting news for you.</Text>
                <Formik initialValues={emailForm} onSubmit={onSubmit}>
                    {() => (
                        <Form>
                            <Flex alignItems="center" mt="2">
                                <Field name="email" validate={emailValidation}>
                                    {({ field, form }: any) => (
                                        <FormControl
                                            isInvalid={form.errors.email && form.touched.email}
                                            onChange={setForm}
                                        >
                                            <InputGroup variant="brand" size="sm">
                                                <InputLeftAddon>
                                                    <Envelope />
                                                </InputLeftAddon>
                                                <Input
                                                    {...field}
                                                    id="email"
                                                    placeholder="Enter your email *"
                                                    className="contact-input"
                                                />
                                                {form.errors.email && form.touched.email ? (
                                                    <Tooltip label="Please enter a valid email address!">
                                                        <InputRightElement color="brand.error">
                                                            <ErrorCircle />
                                                        </InputRightElement>
                                                    </Tooltip>
                                                ) : null}
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                </Field>
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
