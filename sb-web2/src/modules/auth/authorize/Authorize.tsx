import React, { FunctionComponent, useEffect } from 'react';

import { Flex, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { showErrorToast } from 'shared/toast/Toast';
import { Routes } from 'router/Router.Types';
import { Provider } from 'modules/auth/Auth.Service';
import { useAuthStore } from 'modules/auth/Auth.Store';

export const Authorize: FunctionComponent = () => {
    const navigate = useNavigate();
    const [, { authorize }] = useAuthStore();

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const code: string | null = urlSearchParams.get('code');
            const provider: string | null = urlSearchParams.get('provider');
            const state: string | null = urlSearchParams.get('state');

            try {
                if (code && provider) {
                    const success = await authorize(provider as unknown as Provider, code);

                    if (!success) {
                        throw new Error('Could not login. Invalid redirect parameters.');
                    }

                    if (state) {
                        const parsedState = JSON.parse(state);

                        window.location.href = parsedState.path;
                    } else {
                        window.location.href = Routes.Private.Boats;
                    }
                } else {
                    throw new Error('Could not login. Invalid redirect parameters.');
                }
            } catch (err) {
                showErrorToast((err as Error).message);
                navigate(Routes.Public.Auth);
            }
        })();
    });

    return (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <Heading fontWeight="semibold">Redirecting...</Heading>
        </Flex>
    );
};
