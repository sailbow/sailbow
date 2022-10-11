import { FunctionComponent } from 'react';

import { Box, Flex, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { AuthCardType } from 'modules/auth/Auth.Types';
import { AuthCard } from 'modules/auth/common/auth-card/AuthCard';
import { SignInForm } from 'modules/auth/common/sign-in-form/SignInForm';
import { Routes } from 'router/Router.Types';

import './Redirect.scss';

export const Redirect: FunctionComponent = () => {
    const navigate = useNavigate();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const path: string | null = urlSearchParams.get('path');

    if (!path) {
        window.location.href = Routes.Public.Auth;
    }

    return (
        <Box className="sb-redirect">
            {path && (
                <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
                    <AuthCard
                        type={AuthCardType.REDIRECT}
                        title="Log In to Start Sailing"
                        showSocialButtons
                        subtitle={
                            <>
                                Not a member yet? <Link onClick={() => navigate(Routes.Public.Register)}>Sign Up</Link>
                            </>
                        }
                    >
                        <SignInForm />
                    </AuthCard>
                </Flex>
            )}
        </Box>
    );
};
