import React, { FunctionComponent, ChangeEvent, useState } from 'react';

import {
    Input,
    InputGroup,
    InputLeftAddon,
    Textarea,
    VStack,
    Button,
    FormControl,
    InputRightElement,
    Tooltip,
    Flex,
} from '@chakra-ui/react';
import { Form, Formik, Field } from 'formik';

import { Base } from 'screens/whitelisted/Base';
import { ChatRight, Envelope, ErrorCircle } from 'util/Icons';
import { validateEmail } from 'util/Utils';

export const Contact: FunctionComponent = () => {
    const [contactForm, setContactForm] = useState<{ email: string; body: string }>({ email: '', body: '' });

    const onSubmit = () => {
        console.log(contactForm);
    };

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value,
        });
    };

    const emailValidation = (value: string) => {
        if (value) return !validateEmail(value);
        return true;
    };

    const bodyValidation = (value: string) => {
        if (value.length < 10) return true;
        return false;
    };

    return (
        <Base
            title="Contact Us"
            subtitle="We would love to hear from you! Please let us know if you've come across any issues or would like some additional function, or if you just want to drop by and say hi!"
        >
            <Formik initialValues={contactForm} onSubmit={onSubmit}>
                {(props) => (
                    <Form>
                        <VStack spacing="4">
                            <Field name="email" validate={emailValidation}>
                                {({ field, form }: any) => (
                                    <FormControl isInvalid={form.errors.email && form.touched.email} onChange={setForm}>
                                        <InputGroup variant="brand">
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
                            <Field name="body" validate={bodyValidation}>
                                {({ field, form }: any) => (
                                    <FormControl isInvalid={form.errors.body && form.touched.body} onChange={setForm}>
                                        <InputGroup variant="brand">
                                            <InputLeftAddon>
                                                <ChatRight />
                                            </InputLeftAddon>
                                            <Textarea
                                                {...field}
                                                rows="5"
                                                id="body"
                                                placeholder="Pour your heart out! *"
                                                className="contact-input"
                                            />
                                            {form.errors.body && form.touched.body ? (
                                                <Tooltip label="Please type something!">
                                                    <InputRightElement color="brand.error">
                                                        <ErrorCircle />
                                                    </InputRightElement>
                                                </Tooltip>
                                            ) : null}
                                        </InputGroup>
                                    </FormControl>
                                )}
                            </Field>
                            <Flex justifyContent="flex-end" w="100%">
                                <Button isLoading={props.isSubmitting} type="submit" variant="outline">
                                    Submit
                                </Button>
                            </Flex>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </Base>
    );
};
