import { FC } from 'react';

import { Link, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { AuthCardType } from 'modules/auth/Auth.Types';
import { AuthCard } from 'modules/auth/common/auth-card/AuthCard';
import { SignInForm } from 'modules/auth/common/sign-in-form/SignInForm';
import { Routes } from 'router/Router.Types';
import { NavbarHeight } from 'theme';

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
