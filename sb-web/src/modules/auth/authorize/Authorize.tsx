import React, { FunctionComponent, useEffect } from 'react';

import { Flex, Heading } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import { ToastActionType, useToast } from 'modules/toast/Toast';
import { Routes } from 'router/Router.Types';
import { setAuthorizationHeaders } from 'util/http/Http';
import { authorize } from 'modules/auth/Auth.Service';

export const Authorize: FunctionComponent = () => {
    const history = useHistory();
    const [, dispatch] = useToast();

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const code: string | null = urlSearchParams.get('code');
            const provider: string | null = urlSearchParams.get('provider');
            const state: string | null = urlSearchParams.get('state');

            try {
                if (code && provider) {
                    const data = await authorize(provider, code);

                    setAuthorizationHeaders(data.accessToken, data.refreshToken);

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
                dispatch({ type: ToastActionType.ShowError, text: (err as Error).message });
                history.push(Routes.Public.Landing);
            }
        })();
    });

    return (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
            <Heading fontWeight="semibold">Redirecting...</Heading>
        </Flex>
    );
};
