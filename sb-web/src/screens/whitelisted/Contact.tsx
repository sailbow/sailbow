import React, { FunctionComponent, ChangeEvent, useState } from 'react';

import { Button, FormControl, Flex, Text, VStack } from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { Input, TextArea } from 'components/input/Input';
import { Base } from 'screens/whitelisted/Base';
import { ChatRight, Envelope, ErrorCircle } from 'util/Icons';
import { CheckmarkIcon } from 'components/button/ButtonIcons';

interface FormValues {
    email: string;
    body: string;
}

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email!').required('This is a required field!'),
    body: Yup.string().min(1, 'Please enter something!').required('This is a required field!'),
});

export const Contact: FunctionComponent = () => {
    const [contactForm, setContactForm] = useState<FormValues>({ email: '', body: '' });

    const onSubmit = () => {
        console.log(contactForm);
    };

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setContactForm({
            ...contactForm,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Base
            title="Contact Us"
            subtitle="We would love to hear from you! Please let us know if you've come across any issues or would like some additional function, or if you just want to drop by and say hi!"
        >
            <Formik initialValues={contactForm} onSubmit={onSubmit} validationSchema={FormSchema}>
                {({ errors, touched, isSubmitting, getFieldProps }: FormikProps<FormValues>) => (
                    <Form>
                        <VStack spacing="4">
                            <FormControl isInvalid={Boolean(errors.email && touched.email)} onChange={setForm}>
                                <Input
                                    icon={<Envelope />}
                                    field={{ ...getFieldProps('email') }}
                                    error={Boolean(errors.email && touched.email)}
                                    errorLabel={errors.email}
                                    errorIcon={<ErrorCircle />}
                                    props={{
                                        name: 'email',
                                        id: 'email',
                                        placeholder: 'Enter your email *',
                                    }}
                                />
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.body && touched.body)} onChange={setForm}>
                                <TextArea
                                    icon={<ChatRight />}
                                    field={{ ...getFieldProps('body') }}
                                    error={Boolean(errors.body && touched.body)}
                                    errorLabel={errors.body}
                                    errorIcon={<ErrorCircle />}
                                    props={{
                                        name: 'body',
                                        id: 'body',
                                        placeholder: 'Pour your heat out *',
                                        rows: 5,
                                    }}
                                />
                            </FormControl>
                        </VStack>
                        <Flex justifyContent="flex-end" w="100%" mt="8">
                            <Button isLoading={isSubmitting} type="submit" variant="outline" rightIcon={CheckmarkIcon}>
                                <Text>Submit</Text>
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Base>
    );
};
