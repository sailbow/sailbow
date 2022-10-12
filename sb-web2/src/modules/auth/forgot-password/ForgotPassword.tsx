import { ChangeEvent, FC, useState } from 'react';

import { Box, Button, Flex, FormControl, Link, VStack } from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { AuthCard } from 'modules/auth/common/auth-card/AuthCard';
import { Routes } from 'router/Router.Types';
import { Input } from 'shared/input/Input';
import { SbMailIcon } from 'shared/icons/Icons';
import { NavbarHeight } from 'theme';

interface FormValues {
    email: string;
}

const FormSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Please enter your email'),
});

export const ForgotPassword: FC = () => {
    const navigate = useNavigate();
    const [forgotPasswordForm, setForgotPasswordForm] = useState<FormValues>({ email: '' });

    const onSubmit = () => {};

    const setForm = (e: ChangeEvent<HTMLInputElement>) => {
        setForgotPasswordForm({
            ...forgotPasswordForm,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Flex className="sb-login" w="100%" justifyContent="center" pt={{ base: 0, md: NavbarHeight }}>
            <AuthCard
                title="Start Sailing"
                subtitle={
                    <>
                        Remember your password? <Link onClick={() => navigate(Routes.Public.Auth)}>Sign In</Link>
                    </>
                }
            >
                <Box w="100%">
                    <Formik initialValues={forgotPasswordForm} onSubmit={onSubmit} validationSchema={FormSchema}>
                        {({ errors, touched, getFieldProps }: FormikProps<FormValues>) => {
                            return (
                                <Form style={{ width: '100%' }}>
                                    <VStack w="100%" spacing="6">
                                        <FormControl
                                            isInvalid={Boolean(errors.email && touched.email)}
                                            onChange={setForm}
                                        >
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

                                        <Button w="100%" type="submit">
                                            Submit
                                        </Button>
                                    </VStack>
                                </Form>
                            );
                        }}
                    </Formik>
                </Box>
            </AuthCard>
        </Flex>
    );
};
