import { FC, useState, ChangeEvent } from 'react';

import { Box, Button, Flex, FormControl, Link, Text, VStack } from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { SbMailIcon, SbPasswordIcon, SbUserIcon } from 'shared/icons/Icons';
import { Routes } from 'router/Router.Types';
import { Input } from 'shared/input/Input';
import { NavbarHeight } from 'theme';

import { AuthCard } from '../common/auth-card/AuthCard';
import { AuthCardType } from '../Auth.Types';

interface FormValues {
    name: string;
    email: string;
    password1: string;
    password2: string;
}

const FormSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your full name').length(2),
    email: Yup.string().email('Invalid email').required('Please neter your email'),
    password1: Yup.string()
        .required('Please enter your password.')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
    password2: Yup.string()
        .required('Please enter your password.')
        .min(8, 'Your password is too short.')
        .oneOf([Yup.ref('password1')], 'Your passwords do not match.'),
});

export const Register: FC = () => {
    const navigate = useNavigate();
    const [signUpForm, setSignUpForm] = useState<FormValues>({ email: '', password1: '', name: '', password2: '' });

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = () => {
        console.log('logged in', signUpForm);
    };

    return (
        <Flex className="sb-login" w="100%" justifyContent="center" pt={{ base: 0, md: NavbarHeight }}>
            <AuthCard
                title="Start Sailing"
                showSocialButtons
                type={AuthCardType.SIGNUP}
                subtitle={
                    <>
                        Already a member? <Link onClick={() => navigate(Routes.Public.Auth)}>Sign In</Link>
                    </>
                }
            >
                <Box w="100%">
                    <Formik initialValues={signUpForm} onSubmit={onSubmit} validationSchema={FormSchema}>
                        {({ errors, touched, getFieldProps }: FormikProps<FormValues>) => (
                            <Form style={{ width: '100%' }}>
                                <VStack w="100%" spacing="6">
                                    <FormControl isInvalid={Boolean(errors.name && touched.name)} onChange={setForm}>
                                        <Input
                                            label="Full Name"
                                            field={{ ...getFieldProps('name') }}
                                            error={Boolean(errors.name && touched.name)}
                                            errorLabel={errors.name}
                                            required
                                            name="name"
                                            id="name"
                                            placeholder="What do we call you?"
                                            leftIcon={<SbUserIcon />}
                                        />
                                    </FormControl>
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
                                    <FormControl
                                        isInvalid={Boolean(errors.password1 && touched.password1)}
                                        onChange={setForm}
                                    >
                                        <Input
                                            type="password"
                                            label="Password"
                                            field={{ ...getFieldProps('password1') }}
                                            error={Boolean(errors.password1 && touched.password1)}
                                            errorLabel={errors.password1}
                                            required
                                            name="password1"
                                            id="password1"
                                            placeholder="Enter password"
                                            leftIcon={<SbPasswordIcon />}
                                        />
                                        <Text fontSize="xs" color="gray.400" pt="2" fontWeight="normal">
                                            Must contain 8 characters, One uppercase, One lowercase, One number and One
                                            Special character
                                        </Text>
                                    </FormControl>
                                    <FormControl
                                        isInvalid={Boolean(errors.password2 && touched.password2)}
                                        onChange={setForm}
                                    >
                                        <Input
                                            type="password"
                                            label="Confirm Password"
                                            field={{ ...getFieldProps('password2') }}
                                            error={Boolean(errors.password2 && touched.password2)}
                                            errorLabel={errors.password2}
                                            required
                                            name="password2"
                                            id="password2"
                                            placeholder="Retype password"
                                            leftIcon={<SbPasswordIcon />}
                                        />
                                    </FormControl>
                                    <Button w="100%" type="submit">
                                        Sign Up
                                    </Button>
                                </VStack>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </AuthCard>
        </Flex>
    );
};
