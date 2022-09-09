import { ChangeEvent, FC, useState } from 'react';

import { Box, Button, FormControl, Heading, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { Provider } from 'modules/auth/Auth.Service';
import { SbRightArrowIcon, SbFacebookIcon, SbGoogleIcon, SbMailIcon, SbPasswordIcon, Logo } from 'shared/icons/Icons';
import { Input } from 'shared/input/Input';

import { useAuthStore } from '../Auth.Store';
import './AuthCard.scss';

interface Props {
    path?: string;
}

interface FormValues {
    email: string;
    password: string;
}

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('required'),
});

export const AuthCard: FC<Props> = ({ path }) => {
    const [, { providerLogin }] = useAuthStore();
    const [signInForm, setSignInForm] = useState<FormValues>({ email: '', password: '' });
    const colors = {
        card: useColorModeValue('white', 'brand.dark2'),
        cardBorder: useColorModeValue('brand.border-light', 'brand.border-dark'),
    };

    const onLogin = async (provider: Provider) => {
        let state = '';
        if (path) {
            state = encodeURI(JSON.stringify({ path }));
        }

        try {
            const url = await providerLogin(provider, state);

            if (url) {
                window.open(url, '_self');
            }
        } catch (err: any) {
            console.log(err.response);
        }
    };

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setSignInForm({
            ...signInForm,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = () => {
        console.log('logged in');
    };

    const TextDivider: FC<{ text: string }> = ({ text }) => {
        return (
            <Box className="text-divider" _before={{ bg: 'brand.muted' }} _after={{ bg: 'brand.muted' }}>
                {text}
            </Box>
        );
    };

    return (
        <Box
            bg={colors.card}
            p={{ base: '8', md: '16' }}
            borderRadius="xl"
            className="sb-auth-card"
            border="2px solid"
            borderColor={colors.cardBorder}
            minW={{ lg: '450px', base: '100%' }}
            mx={{ base: '12px', md: '0' }}
        >
            <VStack spacing="24" w="100%" className="wrapper">
                <Box textAlign="center">
                    <Box>
                        <Logo width="28px" height="28px" />
                    </Box>
                    <Heading fontSize="3xl" mb="2">
                        Start Sailing
                    </Heading>
                    <Text as="span">
                        Not a member yet? <Link>Sign Up!</Link>
                    </Text>
                </Box>
                <VStack spacing="6" w="100%" className="content">
                    <Formik initialValues={signInForm} onSubmit={onSubmit} validationSchema={FormSchema}>
                        {({ errors, touched, getFieldProps }: FormikProps<FormValues>) => (
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
                                <FormControl
                                    isInvalid={Boolean(errors.password && touched.password)}
                                    onChange={setForm}
                                >
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
                                <Button w="100%" size="lg">
                                    Log in
                                </Button>
                            </VStack>
                        )}
                    </Formik>
                    <TextDivider text="or" />
                    <Button
                        w="100%"
                        size="lg"
                        variant="outline"
                        colorScheme="gray"
                        leftIcon={<SbGoogleIcon />}
                        rightIcon={<SbRightArrowIcon />}
                        onClick={() => onLogin(Provider.Google)}
                    >
                        <Text pr="6">Log In with Google</Text>
                    </Button>
                    <Button
                        w="100%"
                        size="lg"
                        variant="outline"
                        colorScheme="gray"
                        leftIcon={<SbFacebookIcon />}
                        rightIcon={<SbRightArrowIcon />}
                        onClick={() => onLogin(Provider.Facebook)}
                    >
                        <Text pr="2">Log In with Facebook</Text>
                    </Button>

                    <Link>Issues logging in?</Link>
                </VStack>
            </VStack>
        </Box>
    );
};
