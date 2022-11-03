import { ChangeEvent, FC, useState } from 'react';

import { Box, Button, FormControl, Link, VStack } from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { Routes } from 'router/Router.Types';
import { SbMailIcon, SbPasswordIcon } from 'shared/icons/Icons';
import { Input } from 'shared/input/Input';

interface FormValues {
    email: string;
    password: string;
}

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
});

export const SignInForm: FC = () => {
    const navigate = useNavigate();
    const [signInForm, setSignInForm] = useState<FormValues>({ email: '', password: '' });

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setSignInForm({
            ...signInForm,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = () => {
        console.log('logged in', signInForm);
    };

    return (
        <Box w="100%">
            <Formik initialValues={signInForm} onSubmit={onSubmit} validationSchema={FormSchema}>
                {({ errors, touched, getFieldProps }: FormikProps<FormValues>) => (
                    <Form style={{ width: '100%' }}>
                        <VStack w="100%" spacing="6">
                            <FormControl isInvalid={Boolean(errors.email && touched.email)} onChange={setForm}>
                                <Input
                                    label="Email"
                                    field={{ ...getFieldProps('email') }}
                                    error={Boolean(errors.email && touched.email)}
                                    errorLabel={errors.email}
                                    required
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    leftIcon={<SbMailIcon />}
                                />
                            </FormControl>
                            <FormControl isInvalid={Boolean(errors.password && touched.password)} onChange={setForm}>
                                <Input
                                    type="password"
                                    label="Password"
                                    field={{ ...getFieldProps('password') }}
                                    error={Boolean(errors.password && touched.password)}
                                    errorLabel={errors.password}
                                    required
                                    name="password"
                                    id="password"
                                    placeholder="Enter password"
                                    leftIcon={<SbPasswordIcon />}
                                />
                            </FormControl>
                            <VStack w="100%" alignItems="flex-start">
                                <Button w="100%" type="submit">
                                    Log in
                                </Button>
                                <Link
                                    fontSize="xs"
                                    fontWeight="600"
                                    onClick={() => navigate(Routes.Public.ForgotPassword)}
                                >
                                    Forgot Password
                                </Link>
                            </VStack>
                        </VStack>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};
