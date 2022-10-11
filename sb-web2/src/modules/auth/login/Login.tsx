import { FC } from 'react';

import { Link, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Routes } from 'router/Router.Types';
import { NavbarHeight } from 'theme';

import { AuthCardType } from '../Auth.Types';
import { AuthCard } from '../common/auth-card/AuthCard';
import { SignInForm } from '../common/sign-in-form/SignInForm';

export const Login: FC = () => {
    const navigate = useNavigate();

    return (
        <Flex className="sb-login" w="100%" justifyContent="center" pt={{ base: 0, md: NavbarHeight }}>
            <AuthCard
                title="Start Sailing"
                showSocialButtons
                type={AuthCardType.SIGNIN}
                subtitle={
                    <>
                        Not a member yet? <Link onClick={() => navigate(Routes.Public.Register)}>Sign Up</Link>
                    </>
                }
            >
                <SignInForm />
            </AuthCard>
        </Flex>
    );
};
