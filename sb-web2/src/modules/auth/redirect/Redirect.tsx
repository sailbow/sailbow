import { FunctionComponent } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { AuthCard } from 'modules/auth/auth-card/AuthCard';
import { Routes } from 'router/Router.Types';

import { AuthCardType } from '../Auth.Types';

import './Redirect.scss';

export const Redirect: FunctionComponent = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const path: string | null = urlSearchParams.get('path');

    if (!path) {
        window.location.href = Routes.Public.Auth;
    }

    return (
        <Box className="sb-redirect">
            {path && (
                <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
                    <AuthCard type={AuthCardType.REDIRECT} />
                </Flex>
            )}
        </Box>
    );
};
